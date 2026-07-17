// Placeholder data for the Provider Requests view until the systemAdmin
// backend module (backend/src/modules/systemAdmin) exposes a real endpoint.

export type RequestStatus = 'pending' | 'approved' | 'rejected';

export interface ProviderRequest {
  id: number;
  serviceProvider: string;
  document: string;
  fileName: string;
  status: RequestStatus;
}

export const SERVICE_PROVIDERS = ['ColTech', 'Thusanang', 'ITS', 'Academia'] as const;

const DOCUMENTS = [
  'College Information',
  'Programme, Subject & Qualifications',
  'Student Data',
  'Staff Data',
] as const;

const FILE_NAME = 'Practice Note 2_College Performance Reporting Template_2026_FINAL100626v1.xlsx';

const STATUS_CYCLE: RequestStatus[] = ['pending', 'pending', 'approved', 'rejected'];

function buildMockRequests(): ProviderRequest[] {
  const requests: ProviderRequest[] = [];
  let id = 1;

  for (let round = 0; round < 11; round++) {
    for (const provider of SERVICE_PROVIDERS) {
      const document = DOCUMENTS[(round + SERVICE_PROVIDERS.indexOf(provider)) % DOCUMENTS.length];
      const status = STATUS_CYCLE[(round + SERVICE_PROVIDERS.indexOf(provider)) % STATUS_CYCLE.length];
      requests.push({
        id: id++,
        serviceProvider: provider,
        document,
        fileName: FILE_NAME,
        status,
      });
    }
  }

  return requests;
}

export const MOCK_PROVIDER_REQUESTS = buildMockRequests();
