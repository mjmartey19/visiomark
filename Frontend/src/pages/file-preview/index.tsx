import React, { useContext, useEffect } from 'react';
import Layout from '../common/components/Layout';
import GenericTable from '../common/Table/table';
import { useLocation } from 'react-router-dom';
import { appContext } from '../../utils/Context';

const Preview = () => {
  const { responseData, fileName, setFileName } = useContext(appContext);
  const location = useLocation();

  useEffect(() => {
    if (location.state?.name_of_file) {
      setFileName(location.state.name_of_file);
    }
  }, [location.state?.name_of_file]);

  console.log(fileName);
  console.log('Preview ResponseData:', responseData)
  return (
    <Layout>
      <GenericTable tdata={responseData} csv_file_name={fileName} />
    </Layout>
  );
};

export default Preview;
