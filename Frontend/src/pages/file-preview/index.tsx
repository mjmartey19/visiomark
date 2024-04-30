import { useContext } from 'react';
import Layout from '../common/components/Layout';
import GenericTable from '../common/Table/table';
import { useLocation } from 'react-router-dom';
import { appContext } from '../../utils/Context';

const Preview = () => {
  const { responseData } = useContext(appContext);
  return (
    <Layout>
      <GenericTable data={responseData} />
    </Layout>
  );
};

export default Preview;
