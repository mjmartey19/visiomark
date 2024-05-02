export const Constants = {
  API_URL: 'http://127.0.0.1:8000/predict',
  PATHS: {
    home: '/',
    signUp: '/signup',
    signIn: '/signin',
    settings: '/settings',
    allfiles: '/allfiles',
    preview: '/preview',
    statistics: '/statistics',
    logout: '/logout'
  },
  ACADEMIC_LEVELS: [
    {
      value: '100',
      label: '100',
    },
    {
      value: '200',
      label: '200',
    },
    {
      value: '300',
      label: '300',
    },
    {
      value: '400',
      label: '400',
    },
    {
      value: '500',
      label: '500',
    },
    {
      value: '600',
      label: '600',
    },
    {
      value: '700',
      label: '700',
    },
  ],
  ACADEMIC_YEAR: [
    {
      value: '2020/2021',
      label: '2020/2021',
    },
    {
      value: '2021/2022',
      label: '2021/2022',
    },
    {
      value: '2022/2023',
      label: '2022/2023',
    },
    {
      value: '2023/2024',
      label: '2023/2024',
    },
  ],

  RECENTENTRY : [
    {
      name: 'COE 354_050.csv',
      entry: {
        "path": "/path/to/file.txt",
        "name": "file.txt",
      },
      academic_year: '2023/2024',
      marked_time: '2 minutes ago'
    },
    {
      name: 'COE 324_050.csv',
      entry: {
        "path": "/path/to/file.txt",
        "name": "file.txt",
      },
      academic_year: '2023/2024',
      marked_time: '1 day ago'
    },
    {
      name: 'COE 324_050.csv',
      entry: {
        "path": "/path/to/file.txt",
        "name": "file.txt",
      },
      academic_year: '2023/2024',
      marked_time: '1 day ago'
    },
    {
      name: 'ME 304_156.csv',
      entry: {
        "path": "/path/to/file.txt",
        "name": "file.txt",
      },
      academic_year: '2023/2024',
      marked_time: '2 days ago'
    },
    
  ],

};
