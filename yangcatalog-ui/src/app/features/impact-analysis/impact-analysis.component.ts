import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Observable, of, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, finalize, mergeMap, takeUntil } from 'rxjs/operators';
import { ImpactAnalysisService } from './impact-analysis.service';
import { environment } from '../../../environments/environment';
import { ClusteringService, TopologyData } from '@pt/pt-topology';
import { SvgIconService } from './impact-analysis-visualisation/svg-icon.service';
import { ImpactVisNodeModel } from './impact-analysis-visualisation/models/impact-vis-node-model';
import { ImpactAnalysisVisualisationComponent } from './impact-analysis-visualisation/impact-analysis-visualisation.component';
import { ImpactVisLinkModel } from './impact-analysis-visualisation/models/impact-vis-link-model';
import { ImpactAnalysisModel } from './impact-analysis-visualisation/models/impact-analysis-model';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ImpactNodesListComponent } from './impact-analysis-visualisation/impact-nodes-list/impact-nodes-list.component';
import { ImpactWarningsComponent } from './impact-analysis-visualisation/impact-warnings/impact-warnings.component';

@Component({
  selector: 'yc-impact-analysis',
  templateUrl: './impact-analysis.component.html',
  styleUrls: ['./impact-analysis.component.scss']
})
export class ImpactAnalysisComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('visComponent') visComponent: ImpactAnalysisVisualisationComponent;

  form: FormGroup;
  error: any;
  autocomplete = this.autocompleteRequest.bind(this);
  loadingResults = false;

  errors = [];


  highlightedOrg = '';
  highlightedMat = '';
  highlightedDir = '';

  colorsForOrgs = [
    'rgba(217,17,17,1)',
    'rgba(238,146,10,1)',
    'rgba(239,218,53,1)',
    'rgba(195,214,16,1)',
    'rgba(113,210,46,1)',
    'rgba(18,217,144,1)',
    'rgba(19,188,210,1)',
    'rgba(19,44,210,1)',
    'rgba(203,19,222,1)',
    'rgba(217,9,96,1)',
    'rgba(231,14,14,1)',
    'rgba(214,214,214,1)',
  ];

  colorForMats = [
    'rgba(100,32,32,1)', 'rgba(34,83,22,1)', 'rgba(37,90,110,1)', 'rgba(105,23,96,1)'
  ];


  visData: TopologyData;

  organizations: string[] = [];
  orgColors = {};
  orgSelected = {};

  maturities: string[] = [];
  matSelected = {};
  matColors = {};

  directions: string[] = ['dependencies', 'dependents'];
  dirSelected = {dependencies: true, dependents: true};


  myBaseUrl = environment.WEBROOT_BASE_URL;

  private componentDestroyed: Subject<void> = new Subject<void>();
  visOptions = {

    autoResize: true,
    height: '100%',
    width: '100%',
    physics: {
      enabled: false,
    },
    edges: {
      shadow: false,
      smooth: false,
    },
    layout: {
      hierarchical: {
        enabled: false
      }
    },
    nodes: {
      size: 30
    },
    interaction: {
      multiselect: true,
    }
  };
  mainResult: ImpactAnalysisModel;
  contextMenuTop: number = null;
  contextMenuLeft: number = null;
  selectedNode: ImpactAnalysisModel;
  clusterByCompany = false;
  clusterByMaturity = false;
  selectedCluster: any;
  showWarnings = true;


  constructor(
    private fb: FormBuilder,
    private dataService: ImpactAnalysisService,
    private svgService: SvgIconService,
    private clusteringService: ClusteringService,
    private modalService: NgbModal,
    private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.initForm();

    this.route.params.pipe(
      takeUntil(this.componentDestroyed)
    ).subscribe(
      params => {
        if (params.hasOwnProperty('module')) {
          this.form.get('moduleName').setValue(params['module']);
          this.submitModuleName();
        }
      }
    );

  }

  private initForm() {
    this.form = this.fb.group({
      moduleName: [''],
      allowRfc: [true],
      allowSubmodules: [true]
    });
  }

  ngOnDestroy(): void {
    this.componentDestroyed.next();
  }

  ngAfterViewInit(): void {
  }


  onCloseError(i: number) {
    this.errors.splice(i, 1);
  }

  autocompleteRequest(text$: Observable<string>) {
    return text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      mergeMap(term => {
          if (term.length > 2) {
            return this.dataService.getModuleAutocomplete(term.toLowerCase());
          } else {
            return of([]);
          }
        }
      ),
      takeUntil(this.componentDestroyed)
    );
  }


  addOrganizations(organizations: string[]): void {
    organizations.forEach(org => {
      if (this.organizations.indexOf(org) === -1) {
        this.organizations.push(org);
        this.orgColors[org] = this.colorsForOrgs[this.organizations.length - 1];
        this.orgSelected[org] = true;
      }
    });
  }

  addMaturities(maturities: string[]): void {
    maturities.forEach(mat => {
      if (this.maturities.indexOf(mat) === -1) {
        this.maturities.push(mat);
        this.matColors[mat] = this.colorForMats[this.maturities.length - 1];
        this.matSelected[mat] = true;
      }

    });
  }

  submitModuleName() {

    this.showWarnings = true;
    this.mainResult = null;
    this.errors = [];
    this.visData = null;
    this.loadingResults = true;
    this.selectedNode = null;
    this.organizations = [];
    this.orgColors = {};
    this.maturities = [];
    this.matColors = {};

    const moduleNameArr = this.form.get('moduleName').value.split('@');

    this.dataService.getImpactAnalysis(
      moduleNameArr[0],
      this.form.get('allowRfc').value,
      this.form.get('allowSubmodules').value,
      moduleNameArr.length > 1 ? moduleNameArr[1] : null
    ).pipe(
      finalize(() => this.loadingResults = false),
      takeUntil(this.componentDestroyed)
    ).subscribe(
      impactResult => {
        console.log(impactResult);
        this.mainResult = impactResult;
        this.addOrganizations(impactResult.getOrganisations());
        this.addMaturities(impactResult.getMaturities());

        this.visData = new TopologyData();

        this.visData.nodes.push(new ImpactVisNodeModel(impactResult.name, impactResult.name, impactResult.organization, impactResult.maturity, this.orgColors[impactResult.organization], this.matColors[impactResult.maturity], false, false));
        impactResult['dependents'].forEach(dep => {
          if (dep['name']) {
            this.visData.nodes.push(new ImpactVisNodeModel(dep['name'], dep['name'], dep.organization, dep.maturity, this.orgColors[dep.organization], this.matColors[dep.maturity], false, true));
            this.visData.links.push(new ImpactVisLinkModel(dep['name'] + '_' + impactResult.name, dep.name, impactResult['name'], 'rgba(0,0,0,1)', 'from'));
          }
        });

        impactResult['dependencies'].forEach(dep => {
          if (dep['name']) {
            this.visData.nodes.push(new ImpactVisNodeModel(dep['name'], dep['name'], dep.organization, dep.maturity, this.orgColors[dep.organization], this.matColors[dep.maturity], true, false));
            this.visData.links.push(new ImpactVisLinkModel(impactResult.name + '_' + dep.name, impactResult['name'], dep.name, 'rgba(0,0,0,1)', 'from'));
          }
        });

      },
      err => {
        console.error(err);
        this.errors.push(err);
      }
    );
  }

  onOrgMouseMove(org: string) {

    if (this.orgSelected[org] && org !== this.highlightedOrg) {
      this.highlightedOrg = org;

      const nodesToHighlighted = this.visData.nodes.filter((node) => {
        return node['organization'] === org || node['label'] === this.mainResult.name;
      });

      this.visComponent.highlightNodes(nodesToHighlighted, this.orgColors, this.matColors);
    }


  }

  onMatMouseMove(mat: string) {

    if (this.matSelected[mat] && mat !== this.highlightedMat) {
      this.highlightedMat = mat;

      const nodesToHighlighted = this.visData.nodes.filter((node) => {
        return node['maturity'] === mat || node['label'] === this.mainResult.name;
      });

      this.visComponent.highlightNodes(nodesToHighlighted, this.orgColors, this.matColors);
    }


  }

  onDirMouseMove(dir: string) {

    if (this.dirSelected[dir] && dir !== this.highlightedDir) {
      this.highlightedDir = dir;

      const nodesToHighlighted = this.visData.nodes.filter((node) => {
        return (dir === 'dependencies' && node['isDependency']) || (dir === 'dependents' && node['isDependent']) || node['label'] === this.mainResult.name;
      });
      this.visComponent.highlightNodes(nodesToHighlighted, this.orgColors, this.matColors);
    }


  }

  onOrgMouseOut() {
    if (this.highlightedOrg) {
      this.visComponent.undimAllNodes(this.orgColors, this.matColors);
      this.highlightedOrg = '';
    }
  }


  onMatMouseOut() {
    if (this.highlightedMat) {
      this.visComponent.undimAllNodes(this.orgColors, this.matColors);
      this.highlightedMat = '';
    }
  }

  onDirMouseOut() {
    if (this.highlightedDir) {
      this.visComponent.undimAllNodes(this.orgColors, this.matColors);
      this.highlightedDir = '';
    }
  }

  onOrgToggle(checked, organization: string) {
    this.orgSelected[organization] = checked;
    const nodes = this.visData.nodes.filter(node => node['organization'] === organization && node['label'] !== this.mainResult.name);
    nodes.forEach(node => node['hidden'] = !checked);
    this.visComponent.updateNodes(nodes);
    if (checked) {
      this.onOrgMouseMove(organization);
    } else {
      this.onOrgMouseOut();
    }
  }

  onMatToggle(checked, mat: string) {
    this.matSelected[mat] = checked;
    const nodes = this.visData.nodes.filter(node => node['maturity'] === mat && node['label'] !== this.mainResult.name);
    nodes.forEach(node => node['hidden'] = !checked);
    this.visComponent.updateNodes(nodes);
    if (checked) {
      this.onMatMouseMove(mat);
    } else {
      this.onMatMouseOut();
    }
  }

  onDirToggle(checked, dir: string) {
    this.dirSelected[dir] = checked;
    const nodes = this.visData.nodes.filter(node => ((dir === 'dependencies' && node['isDependency']) || (dir === 'dependents' && node['isDependent'])) && node['label'] !== this.mainResult.name);
    nodes.forEach(node => node['hidden'] = !checked);
    this.visComponent.updateNodes(nodes);
    if (checked) {
      this.onDirMouseMove(dir);
    } else {
      this.onDirMouseOut();
    }
  }

  onClusterCompaniesToggle(clustered: boolean) {
    if (clustered) {
      if (this.clusterByMaturity) {
        this.clusterByMaturity = false;
        this.onClusterMaturityToggle(false);
      }
      this.organizations.forEach(organization => {
        const clusterOptionsByData = {
          joinCondition: (childOptions) => {
            return childOptions['organization'] === organization && childOptions['label'] !== this.mainResult.name;
          },
          releaseFunction: () => {
            return {};
          },
          processProperties: (clusterOptions, childNodes, childEdges) => {
            let totalMass = 0;
            childNodes.forEach(childNode => totalMass += childNode.mass);
            clusterOptions.mass = totalMass;
            return clusterOptions;
          },
          clusterNodeProperties: {
            id: 'cluster_org_' + organization,
            borderWidth: 3,
            shape: 'dot',
            color: this.orgColors[organization],
            size: 15 + Math.round(this.mainResult.getOrganizationMembersCount(organization) * 0.75),
            label: `${organization} (${this.mainResult.getOrganizationMembersCount(organization)})`,
          },
        };
        this.visComponent.cluster(clusterOptionsByData);
        this.visComponent.redraw();
      });

      this.organizations.forEach(org => {
        if (!this.orgSelected[org]) {
          this.onOrgToggle(true, org);
        }
      });
      this.maturities.forEach(mat => {
        if (!this.matSelected[mat]) {
          this.onMatToggle(true, mat);
        }
      });
      this.directions.forEach(dir => {
        if (!this.dirSelected[dir]) {
          this.onMatToggle(true, dir);
        }
      });
      this.onOrgMouseOut();

    } else {
      this.organizations.forEach(org => {
        let membersCount = this.mainResult.getOrganizationMembersCount(org);
        if (org === this.mainResult.organization) {
          membersCount--;
        }
        if (membersCount > 1) {
          this.visComponent.openCluster('cluster_org_' + org);
        }
      });
    }

  }

  onClusterMaturityToggle(clustered: boolean) {
    if (clustered) {
      if (this.clusterByCompany) {
        this.clusterByCompany = false;
        this.onClusterCompaniesToggle(false);
      }
      this.maturities.forEach(maturity => {
        const clusterOptionsByData = {
          joinCondition: (childOptions) => {
            return childOptions['maturity'] === maturity && childOptions['label'] !== this.mainResult.name;
          },
          releaseFunction: () => {
            return {};
          },
          processProperties: (clusterOptions, childNodes, childEdges) => {
            let totalMass = 0;
            childNodes.forEach(childNode => totalMass += childNode.mass);
            clusterOptions.mass = totalMass;
            return clusterOptions;
          },
          clusterNodeProperties: {
            id: 'cluster_mat_' + maturity,
            borderWidth: 3,
            shape: 'dot',
            color: this.matColors[maturity],
            size: 15 + Math.round(this.mainResult.getMaturityMembersCount(maturity) * 0.75),
            label: `${maturity} (${this.mainResult.getMaturityMembersCount(maturity)})`,
          },
        };
        this.visComponent.cluster(clusterOptionsByData);
        this.visComponent.redraw();
      });

      this.organizations.forEach(org => {
        if (!this.orgSelected[org]) {
          this.onOrgToggle(true, org);
        }
      });
      this.maturities.forEach(mat => {
        if (!this.matSelected[mat]) {
          this.onMatToggle(true, mat);
        }
      });
      this.directions.forEach(dir => {
        if (!this.dirSelected[dir]) {
          this.onMatToggle(true, dir);
        }
      });
      this.onMatMouseOut();

    } else {
      this.maturities.forEach(mat => {
        let membersCount = this.mainResult.getMaturityMembersCount(mat);
        if (mat === this.mainResult.maturity) {
          membersCount--;
        }
        if (membersCount > 1) {
          this.visComponent.openCluster('cluster_mat_' + mat);
        }
      });
    }

  }

  onClickNode(event) {
    this.selectedCluster = null;
    this.selectedNode = null;
    this.contextMenuTop = event['pointer']['DOM']['y'];
    this.contextMenuLeft = event['pointer']['DOM']['x'];
    const clickedNodeId = event['nodes'][event['nodes'].length - 1];
    if (clickedNodeId.indexOf('cluster_') !== -1) {
      this.selectedCluster = clickedNodeId;
    } else {
      this.selectedNode = this.mainResult.getNodeByName(clickedNodeId);
    }
  }

  onClickCanvas() {
    this.contextMenuLeft = null;
    this.contextMenuTop = null;
    this.selectedNode = null;
    this.selectedCluster = null;
  }

  onLoadMore() {
    this.dataService.getImpactAnalysis(
      this.selectedNode.name,
      this.form.get('allowRfc').value,
      this.form.get('allowSubmodules').value
    ).pipe(
      finalize(() => this.loadingResults = false),
      takeUntil(this.componentDestroyed)
    ).subscribe(
      impactResult => {

        this.addOrganizations(impactResult.getOrganisations());
        this.addMaturities(impactResult.getMaturities());


        const newNodes = [];
        const newLinks = [];

        impactResult['dependents'].forEach(dep => {
          if (dep['name']) {
            const newNode = new ImpactVisNodeModel(dep['name'], dep['name'], dep.organization, dep.maturity, this.orgColors[dep.organization], this.matColors[dep.maturity], false, true);
            this.visData.nodes.push(newNode);
            newNodes.push(newNode);

            const newLink = new ImpactVisLinkModel(dep['name'] + '_' + impactResult.name, dep.name, impactResult['name'], 'rgba(0,0,0,1)', 'to');
            this.visData.links.push(newLink);
            newLinks.push(newLink);
          }
        });

        impactResult['dependencies'].forEach(dep => {
          if (dep['name']) {
            const newNode = new ImpactVisNodeModel(dep['name'], dep['name'], dep.organization, dep.maturity, this.orgColors[dep.organization], this.matColors[dep.maturity], true, false);
            this.visData.nodes.push(newNode);
            newNodes.push(newNode);
            const newLink = new ImpactVisLinkModel(impactResult.name + '_' + dep.name, impactResult['name'], dep.name, 'rgba(0,0,0,1)', 'from');
            this.visData.links.push(newLink);
            newLinks.push(newLink);
          }
        });
        this.visComponent.updateNodes(newNodes);
        this.visComponent.updateLinks(newLinks);

        this.selectedNode = null;

      },
      err => {
        console.error(err);
        this.selectedNode = null;
        this.errors.push(err);
      }
    );

  }

  rearrange() {
    this.visComponent.redraw();
  }

  onShowClusterNodesList(selectedClusterId: string) {
    const modalNodeDetail: ImpactNodesListComponent = this.modalService.open(ImpactNodesListComponent, {
      size: 'lg',
    }).componentInstance;

    if (selectedClusterId.indexOf('_org_') !== -1) {
      modalNodeDetail.nodesList = this.mainResult.getOrganizationMembers(selectedClusterId.replace('cluster_org_', ''));
    } else {
      modalNodeDetail.nodesList = this.mainResult.getMaturityMembers(selectedClusterId.replace('cluster_mat_', ''));
    }

    this.selectedCluster = null;
  }

  onToolbarClick() {
    this.selectedNode = null;
    this.selectedCluster = null;
  }

  onShowWarningsClick() {
    const warningsComp: ImpactWarningsComponent = this.modalService.open(ImpactWarningsComponent, {
      size: 'lg',
    }).componentInstance;

    warningsComp.warnings = this.mainResult.warnings;

  }

  onCloseWarnings() {
    this.showWarnings = false;
  }
}
