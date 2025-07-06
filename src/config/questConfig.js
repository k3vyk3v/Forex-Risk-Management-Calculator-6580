// Quest SDK Configuration
export const questConfig = {
  // GetStarted Quest Configuration
  GET_STARTED_QUESTID: 'c-greta-get-started',
  USER_ID: 'u-4f8e6c47-347c-4e45-98e4-4698b84f41cc',
  APIKEY: 'k-47fbb1b7-d61f-4c83-9958-61bee8348b59',
  TOKEN: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ1LTRmOGU2YzQ3LTM0N2MtNGU0NS05OGU0LTQ2OThiODRmNDFjYyIsImlhdCI6MTc1MTgxMDkxMCwiZXhwIjoxNzU0NDAyOTEwfQ.67nfCM0Lnv_FlRkCWj4xREW9p5JtJkNQUfLU9NDXoSc',
  ENTITYID: 'e-44b7ec47-5d62-4b13-ba5d-f00cb0229dd4',
  
  // Extract primary color from existing UI (blue-600 from your theme)
  PRIMARY_COLOR: '#2563eb'
};

// Initialize user ID in localStorage if not present
if (typeof window !== 'undefined' && !localStorage.getItem('userId')) {
  localStorage.setItem('userId', questConfig.USER_ID);
}