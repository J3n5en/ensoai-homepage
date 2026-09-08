export type ProductId = 'ensocode' | 'ensoai';

export interface Product {
  id: ProductId;
  name: string;
  logo: string;
  githubUrl: string;
  downloadUrl: string;
}

export const products: Record<ProductId, Product> = {
  ensocode: {
    id: 'ensocode',
    name: 'EnsoCode',
    logo: '/ensocode/logo.png',
    githubUrl: 'https://github.com/J3n5en/EnsoCode',
    downloadUrl: 'https://github.com/J3n5en/EnsoCode/releases/latest',
  },
  ensoai: {
    id: 'ensoai',
    name: 'EnsoAI',
    logo: '/logo.png',
    githubUrl: 'https://github.com/j3n5en/EnsoAI',
    downloadUrl: 'https://github.com/j3n5en/EnsoAI/releases/latest',
  },
};

export const defaultProduct: ProductId = 'ensocode';
