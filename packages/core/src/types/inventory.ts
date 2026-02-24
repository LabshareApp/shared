// Canonical inventory domain types for shared-core.

export enum TagCategory {
  Location = 'location',
  Grant = 'grant',
  Label = 'label',
  UploadedBy = 'uploaded_by',
}

export enum FilterOperation {
  AND = 'AND',
  OR = 'OR',
}

export enum AttributeOperator {
  Equals = 'eq',
  NotEquals = 'ne',
  Contains = 'contains',
  StartsWith = 'startswith',
  EndsWith = 'endswith',

  GreaterThan = 'gt',
  GreaterThanOrEqual = 'gte',
  LessThan = 'lt',
  LessThanOrEqual = 'lte',

  Exists = 'exists',
  DoesNotExist = 'does_not_exist',
}

export interface BackendTag {
  id: string;
  labId: string;
  name: string;
  category: TagCategory;
  description?: string;
  isSublocation?: boolean;
  parentLocationId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TagFilter {
  category: TagCategory;
  tagIds?: string[];
  noTags?: boolean;
  operator?: FilterOperation;
  groupId?: string;
}

export interface AttributeFilter {
  field: string;
  operator: string;
  value: any;
  valueType?: string;
}

export interface FilterGroup {
  id?: string;
  filters: TagFilter[];
  operation: FilterOperation;
}

export interface SearchCriteria {
  filters?: TagFilter[];
  groups?: FilterGroup[];
  operation: FilterOperation;
  attributeFilters?: AttributeFilter[];
}

export interface SearchRequest {
  useCustomGroup?: boolean;
  customGroupId?: string;
  query: SearchCriteria;
  globalSearchTerm?: string;
  view?: 'current' | 'placed' | 'archived';
  selectedLabIds?: string[]; // For collaborator inventory filtering
}

export interface PaginatedSearchResult<T> {
  items: T[];
  totalCount: number;
  page?: number;
  limit?: number;
}

export interface BackendCustomGroup {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  labId?: string;
  userId?: string;
  private?: boolean;
  query: SearchCriteria;
  createdAt?: string;
  updatedAt?: string;
  order?: number;
}

export interface BrandInfo {
  quantity: number;
  price?: {
    amount: number;
    currency: string;
  };
}

export enum StateOfMatter {
  Liquid = 'liquid',
  Gas = 'gas',
  Solid = 'solid',
  Plasma = 'plasma',
}

export interface InventoryItem {
  id: string;
  name: string;
  description?: string;
  brands: { [brandName: string]: BrandInfo };
  totalQuantity: number;
  units?: string;
  userId?: string;
  uploadedByUserName?: string; // Resolved user name (server-side populated)
  labId: string;
  isPrivate?: boolean; // If true, item is hidden from collaborating labs
  createdAt: string;
  updatedAt: string;
  casNumber?: string;
  stateOfMatter?: StateOfMatter;
  attributes?: {
    amountAdded?: number;
    expirationDate?: string | null;
    lotNumber?: string;
  };

  locationTags?: string[];
  grantTags?: string[];
  labelTags?: string[];
  uploadedByTags?: string[];

  locationTagNames?: string[];
  grantTagNames?: string[];
  labelTagNames?: string[];
  uploadedByTagNames?: string[];

  locationTagsCount?: number;
  grantTagsCount?: number;
  labelTagsCount?: number;
  uploadedByTagsCount?: number;
  totalTagsCount?: number;

  customFields?: { [key: string]: any };
  documents?: string[]; // S3 URLs to attached documents (PDFs, etc.)
  quotes?: string[]; // S3 URLs to quote PDFs (transferred from order request on fulfillment)
  images?: string[]; // S3 URLs to attached images
  displayImage?: string; // S3 URL of the image to display as thumbnail (must be one of images[])
  [key: string]: any;
}

export interface CreateItemData {
  name: string;
  userId?: string;
  description?: string;
  notes?: string;
  brands: { [brandName: string]: BrandInfo };
  totalQuantity: number;
  catalog: string;
  units?: string;
  casNumber?: string;
  stateOfMatter?: StateOfMatter;
  isPrivate?: boolean; // If true, item is hidden from collaborating labs
  attributes?: {
    expirationDate?: string | null;
    lotNumber?: string;
    amountAdded?: number;
  };
  customFields?: Record<string, any>;
  quotes?: string[]; // S3 URLs to quote PDFs
  images?: string[]; // S3 URLs to attached images
  displayImage?: string; // S3 URL of the image to display as thumbnail
}

export interface CreateCustomGroupData {
  name: string;
  description?: string;
  icon?: string;
  query: SearchCriteria;
  private?: boolean;
}

export interface UpdateCustomGroupData {
  id: string;
  name?: string;
  description?: string;
  icon?: string;
  query?: SearchCriteria;
  private?: boolean;
}

export interface CreateTagData {
  name: string;
  category: TagCategory;
  description?: string;
  isSublocation?: boolean;
  parentLocationId?: string;
}

export interface CreateSublocationData {
  name: string;
  parentLocationId: string;
  description?: string;
}

export interface BulkTagResponse {
  matchedCount: number;
  updatedCount: number;
}

