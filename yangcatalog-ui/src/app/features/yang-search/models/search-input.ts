export interface SearchInput {
  'searched-term': string;
  'case-sensitive': boolean;
  'type': string;
  'include-mibs': boolean;
  'latest-revision': boolean;
  'searched-fields': string[];
  'yang-versions': string[];
  'schema-types': string[];
  // 'output-columns': string[];
  // 'sub-search': any[];
}
