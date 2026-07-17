import { useMemo, useState } from 'react';
import Tabs, { type TabOption } from '../../../components/Tabs/Tabs';
import Select from '../../../components/Select/Select';
import IconButton from '../../../components/IconButton/IconButton';
import Pagination from '../../../components/Pagination/Pagination';
import Modal from '../../../components/Modal/Modal';
import {
  MOCK_PROVIDER_REQUESTS,
  SERVICE_PROVIDERS,
  type ProviderRequest,
  type RequestStatus,
} from '../mockData';
import '../css/ProviderRequestsView.css';

const STATUS_TABS: TabOption<RequestStatus>[] = [
  { value: 'pending', label: 'Pending' },
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' },
];

const PROVIDER_OPTIONS = [
  { value: '', label: 'All service providers' },
  ...SERVICE_PROVIDERS.map((provider) => ({ value: provider, label: provider })),
];

const PAGE_SIZE = 4;

export default function ProviderRequestsView() {
  const [requests, setRequests] = useState<ProviderRequest[]>(MOCK_PROVIDER_REQUESTS);
  const [statusFilter, setStatusFilter] = useState<RequestStatus>('pending');
  const [providerFilter, setProviderFilter] = useState('');
  const [page, setPage] = useState(1);
  const [viewingRequest, setViewingRequest] = useState<ProviderRequest | null>(null);

  const filtered = useMemo(
    () =>
      requests.filter(
        (request) =>
          request.status === statusFilter &&
          (providerFilter === '' || request.serviceProvider === providerFilter)
      ),
    [requests, statusFilter, providerFilter]
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageItems = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  function handleStatusChange(status: RequestStatus) {
    setStatusFilter(status);
    setPage(1);
  }

  function handleProviderChange(provider: string) {
    setProviderFilter(provider);
    setPage(1);
  }

  function updateStatus(id: number, status: RequestStatus) {
    setRequests((prev) => prev.map((request) => (request.id === id ? { ...request, status } : request)));
  }

  return (
    <section className="providerRequestsCard">
      <div className="providerRequestsHeader">
        <h1 className="providerRequestsTitle">Provider Requests</h1>

        <div className="providerRequestsControls">
          <Tabs options={STATUS_TABS} value={statusFilter} onChange={handleStatusChange} />
          <Select
            options={PROVIDER_OPTIONS}
            value={providerFilter}
            onChange={(e) => handleProviderChange(e.target.value)}
            aria-label="Filter by service provider"
          />
        </div>
      </div>

      <div className="providerRequestsTableWrap">
        <table className="providerRequestsTable">
          <thead>
            <tr>
              <th>Service Provider</th>
              <th>Document</th>
              <th>File Name</th>
              <th className="actionsHeader">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pageItems.length === 0 && (
              <tr>
                <td colSpan={4} className="emptyRow">
                  No {statusFilter} requests found.
                </td>
              </tr>
            )}
            {pageItems.map((request, index) => {
              const showProvider = index === 0 || pageItems[index - 1].serviceProvider !== request.serviceProvider;
              return (
                <tr key={request.id}>
                  <td className="providerCell">{showProvider ? request.serviceProvider : ''}</td>
                  <td className="documentCell">{request.document}</td>
                  <td className="fileNameCell" title={request.fileName}>
                    {request.fileName}
                  </td>
                  <td className="actionsCell">
                    <IconButton
                      variant="success"
                      icon={<CheckIcon />}
                      aria-label={`Approve ${request.document} from ${request.serviceProvider}`}
                      disabled={request.status === 'approved'}
                      onClick={() => updateStatus(request.id, 'approved')}
                    />
                    <IconButton
                      variant="danger"
                      icon={<CrossIcon />}
                      aria-label={`Reject ${request.document} from ${request.serviceProvider}`}
                      disabled={request.status === 'rejected'}
                      onClick={() => updateStatus(request.id, 'rejected')}
                    />
                    <IconButton
                      variant="neutral"
                      icon={<EyeIcon />}
                      aria-label={`View ${request.document} from ${request.serviceProvider}`}
                      onClick={() => setViewingRequest(request)}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setPage} />

      {viewingRequest && (
        <Modal onClose={() => setViewingRequest(null)} labelledBy="view-request-title">
          <h2 id="view-request-title" className="viewModalTitle">
            {viewingRequest.document}
          </h2>
          <dl className="viewModalDetails">
            <dt>Service provider</dt>
            <dd>{viewingRequest.serviceProvider}</dd>
            <dt>File name</dt>
            <dd>{viewingRequest.fileName}</dd>
            <dt>Status</dt>
            <dd className="viewModalStatus">{viewingRequest.status}</dd>
          </dl>
        </Modal>
      )}
    </section>
  );
}

function CheckIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CrossIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M3 12s3.5-7 9-7 9 7 9 7-3.5 7-9 7-9-7-9-7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}
