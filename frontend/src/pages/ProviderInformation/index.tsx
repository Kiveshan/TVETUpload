import PortalLayout from '../../layouts/PortalLayout/PortalLayout';
import Breadcrumb from '../../components/Breadcrumb/Breadcrumb';
import { PATHS } from '../../routes/paths';

const steps = [
  { label: 'Provider' },
  { label: 'College Upload', href: PATHS.collegeUpload },
  { label: 'Summary & Confirmation' },
];

export default function ProviderInformation() {
  return (
    <PortalLayout>
      <Breadcrumb items={steps} activeStep={1} />
    </PortalLayout>
  );
}
