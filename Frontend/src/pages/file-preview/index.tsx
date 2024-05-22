import { useContext } from 'react';
import Layout from '../common/components/Layout';
import GenericTable from '../common/Table/table';
import { useLocation } from 'react-router-dom';
import { appContext } from '../../utils/Context';

const Preview = () => {
  const { responseData } = useContext(appContext);
  const location = useLocation();
  const { name_of_file } = location.state;

  return (
    <Layout>
      <GenericTable data={responseData} csv_file_name={name_of_file}/>
    </Layout>
  );
};

export default Preview;
