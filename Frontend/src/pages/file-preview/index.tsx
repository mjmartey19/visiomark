import React, { useContext, useEffect } from 'react';
import Layout from '../common/components/Layout';
import GenericTable from '../common/Table/table';
import { appContext } from '../../utils/Context';

const Preview = () => {
  const { responseData, fileName, setFileName } = useContext(appContext);


  console.log(fileName);

  return (
    <Layout>
      <GenericTable data={responseData} csv_file_name={fileName} />
    </Layout>
  );
};

export default Preview;
