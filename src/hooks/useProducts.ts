import { useState, useEffect } from 'react';
import { Product } from '../data/products';
import { products } from '../data/products';

interface UseProductsState {
  products: Product[];
  loading: boolean;
  error: string | null;
  totalResults: number;
  page: number;
  totalPages: number;
}

interface UseProductsParams {
  category?: string;
  search?: string;
  page?: number;
  limit?: number;
  minPrice?: number;
  maxPrice?: number;
  sort?: string;
}

export function useProducts(params: UseProductsParams = {}) {
  const [state, setState] = useState<UseProductsState>({
    products: [],
    loading: true,
    error: null,
    totalResults: 0,
    page: 1,
    totalPages: 0,
  });

  useEffect(() => {
    let isMounted = true;

    const fetchProducts = async () => {
      try {
        setState(prev => ({ ...prev, loading: true, error: null }));
        
        // Filter products based on params
        let filteredProducts = [...products];
        
        if (params.category) {
          filteredProducts = filteredProducts.filter(p => p.category === params.category);
        }
        
        if (params.search) {
          const searchLower = params.search.toLowerCase();
          filteredProducts = filteredProducts.filter(p => 
            p.name.toLowerCase().includes(searchLower) ||
            p.description.toLowerCase().includes(searchLower)
          );
        }
        
        if (params.minPrice) {
          filteredProducts = filteredProducts.filter(p => p.price >= params.minPrice!);
        }
        
        if (params.maxPrice) {
          filteredProducts = filteredProducts.filter(p => p.price <= params.maxPrice!);
        }
        
        // Sort products
        if (params.sort) {
          switch (params.sort) {
            case 'price-low':
              filteredProducts.sort((a, b) => a.price - b.price);
              break;
            case 'price-high':
              filteredProducts.sort((a, b) => b.price - a.price);
              break;
            case 'rating':
              filteredProducts.sort((a, b) => b.rating - a.rating);
              break;
            case 'name':
            default:
              filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
              break;
          }
        }
        
        const totalResults = filteredProducts.length;
        const limit = params.limit || 20;
        const page = params.page || 1;
        const totalPages = Math.ceil(totalResults / limit);
        
        // Apply pagination
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedProducts = filteredProducts.slice(startIndex, endIndex);
        
        if (isMounted) {
          setState({
            products: paginatedProducts,
            loading: false,
            error: null,
            totalResults,
            page,
            totalPages,
          });
        }
      } catch (error) {
        if (isMounted) {
          setState(prev => ({
            ...prev,
            loading: false,
            error: error instanceof Error ? error.message : 'Failed to fetch products',
          }));
        }
      }
    };

    fetchProducts();

    return () => {
      isMounted = false;
    };
  }, [JSON.stringify(params)]);

  return state;
}

export function useProduct(id: string) {
  const [state, setState] = useState<{
    product: Product | null;
    loading: boolean;
    error: string | null;
  }>({
    product: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    let isMounted = true;

    const fetchProduct = async () => {
      if (!id) return;

      try {
        setState(prev => ({ ...prev, loading: true, error: null }));
        
        const product = products.find(p => p.id === id);
        
        if (isMounted) {
          setState({
            product: product || null,
            loading: false,
            error: product ? null : 'Product not found',
          });
        }
      } catch (error) {
        if (isMounted) {
          setState({
            product: null,
            loading: false,
            error: error instanceof Error ? error.message : 'Failed to fetch product',
          });
        }
      }
    };

    fetchProduct();

    return () => {
      isMounted = false;
    };
  }, [id]);

  return state;
}

export function useFeaturedProducts() {
  const [state, setState] = useState<{
    products: Product[];
    loading: boolean;
    error: string | null;
  }>({
    products: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    let isMounted = true;

    const fetchFeaturedProducts = async () => {
      try {
        setState(prev => ({ ...prev, loading: true, error: null }));
        
        // Get first 4 products as featured
        const featuredProducts = products.slice(0, 4);
        
        if (isMounted) {
          setState({
            products: featuredProducts,
            loading: false,
            error: null,
          });
        }
      } catch (error) {
        if (isMounted) {
          setState({
            products: [],
            loading: false,
            error: error instanceof Error ? error.message : 'Failed to fetch featured products',
          });
        }
      }
    };

    fetchFeaturedProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  return state;
}

export function useProductsByCategory(category: string) {
  const [state, setState] = useState<{
    products: Product[];
    loading: boolean;
    error: string | null;
  }>({
    products: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    let isMounted = true;

    const fetchProductsByCategory = async () => {
      if (!category) return;

      try {
        setState(prev => ({ ...prev, loading: true, error: null }));
        
        const categoryProducts = products.filter(p => p.category === category);
        
        if (isMounted) {
          setState({
            products: categoryProducts,
            loading: false,
            error: null,
          });
        }
      } catch (error) {
        if (isMounted) {
          setState({
            products: [],
            loading: false,
            error: error instanceof Error ? error.message : 'Failed to fetch products by category',
          });
        }
      }
    };

    fetchProductsByCategory();

    return () => {
      isMounted = false;
    };
  }, [category]);

  return state;
}