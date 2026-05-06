import React, { useEffect, useState } from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';
import axios from 'axios';
import AllProducts from '../Products/AllProducts';
import { formatPrice } from '../Products/productCatalog';

const DEFAULT_SORT = 'featured';
const DEFAULT_LIMIT = 12;
const PAGE_SIZE_OPTIONS = [12, 24, 36];
const RATING_OPTIONS = [4, 3, 2];

const parseListParam = (value) =>
  String(value || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

const parsePositiveInt = (value, fallback) => {
  const parsed = parseInt(value, 10);

  if (Number.isNaN(parsed) || parsed <= 0) {
    return fallback;
  }

  return parsed;
};

const getVisiblePages = (currentPage, totalPages) => {
  const pages = [];
  let start = Math.max(1, currentPage - 2);
  let end = Math.min(totalPages, currentPage + 2);

  if (end - start < 4) {
    if (start === 1) {
      end = Math.min(totalPages, start + 4);
    } else if (end === totalPages) {
      start = Math.max(1, end - 4);
    }
  }

  for (let page = start; page <= end; page += 1) {
    pages.push(page);
  }

  return pages;
};

const Dashboard = () => {
  const history = useHistory();
  const location = useLocation();
  const params = new URLSearchParams(location.search);

  const filterState = {
    searchQuery: params.get('q') || '',
    categories: parseListParam(params.get('category')),
    brands: parseListParam(params.get('brand')),
    deliveryOptions: parseListParam(params.get('delivery')),
    stockOptions: parseListParam(params.get('stock')),
    minPrice: params.get('minPrice') || '',
    maxPrice: params.get('maxPrice') || '',
    minRating: params.get('minRating') || '',
    sort: params.get('sort') || DEFAULT_SORT,
    page: parsePositiveInt(params.get('page'), 1),
    limit: parsePositiveInt(params.get('limit'), DEFAULT_LIMIT)
  };

  const [catalog, setCatalog] = useState({
    products: [],
    pagination: {
      page: 1,
      limit: DEFAULT_LIMIT,
      total: 0,
      totalPages: 1,
      offset: 0,
      hasNextPage: false,
      hasPrevPage: false,
      from: 0,
      to: 0
    },
    filters: {
      categories: [],
      brands: [],
      delivery: [],
      stock: [],
      priceRange: {
        min: 0,
        max: 0
      }
    }
  });
  const [loading, setLoading] = useState(true);
  const [priceDraft, setPriceDraft] = useState({
    minPrice: filterState.minPrice,
    maxPrice: filterState.maxPrice
  });

  useEffect(() => {
    setPriceDraft({
      minPrice: filterState.minPrice,
      maxPrice: filterState.maxPrice
    });
  }, [filterState.minPrice, filterState.maxPrice]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);

      try {
        const res = await axios.get(`/api/products${location.search || ''}`);
        setCatalog(res.data);
      } catch (err) {
        console.error('Error fetching products:', err);
        setCatalog((current) => ({
          ...current,
          products: [],
          pagination: {
            page: 1,
            limit: filterState.limit,
            total: 0,
            totalPages: 1,
            offset: 0,
            hasNextPage: false,
            hasPrevPage: false,
            from: 0,
            to: 0
          }
        }));
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [location.search, filterState.limit]);

  const pushFilters = (nextState, resetPage = true) => {
    const nextParams = new URLSearchParams();
    const normalizedState = {
      ...filterState,
      ...nextState
    };

    const page = resetPage
      ? 1
      : parsePositiveInt(normalizedState.page, filterState.page);

    if (normalizedState.searchQuery.trim()) {
      nextParams.set('q', normalizedState.searchQuery.trim());
    }

    if (normalizedState.categories.length) {
      nextParams.set('category', normalizedState.categories.join(','));
    }

    if (normalizedState.brands.length) {
      nextParams.set('brand', normalizedState.brands.join(','));
    }

    if (normalizedState.deliveryOptions.length) {
      nextParams.set('delivery', normalizedState.deliveryOptions.join(','));
    }

    if (normalizedState.stockOptions.length) {
      nextParams.set('stock', normalizedState.stockOptions.join(','));
    }

    if (normalizedState.minPrice !== '') {
      nextParams.set('minPrice', normalizedState.minPrice);
    }

    if (normalizedState.maxPrice !== '') {
      nextParams.set('maxPrice', normalizedState.maxPrice);
    }

    if (normalizedState.minRating !== '') {
      nextParams.set('minRating', normalizedState.minRating);
    }

    if (normalizedState.sort && normalizedState.sort !== DEFAULT_SORT) {
      nextParams.set('sort', normalizedState.sort);
    }

    if (normalizedState.limit !== DEFAULT_LIMIT) {
      nextParams.set('limit', normalizedState.limit);
    }

    if (page > 1) {
      nextParams.set('page', page);
    }

    history.push(`/products${nextParams.toString() ? `?${nextParams.toString()}` : ''}`);
  };

  const toggleFilterValue = (key, value) => {
    const currentValues = filterState[key];
    const nextValues = currentValues.includes(value)
      ? currentValues.filter((item) => item !== value)
      : [...currentValues, value];

    pushFilters({ [key]: nextValues });
  };

  const applyPriceFilter = (event) => {
    event.preventDefault();

    let { minPrice, maxPrice } = priceDraft;
    minPrice = minPrice.trim();
    maxPrice = maxPrice.trim();

    if (minPrice && maxPrice && Number(minPrice) > Number(maxPrice)) {
      const swappedMin = maxPrice;
      maxPrice = minPrice;
      minPrice = swappedMin;
      setPriceDraft({ minPrice, maxPrice });
    }

    pushFilters({ minPrice, maxPrice });
  };

  const clearFilters = () => {
    pushFilters({
      categories: [],
      brands: [],
      deliveryOptions: [],
      stockOptions: [],
      minPrice: '',
      maxPrice: '',
      minRating: '',
      sort: DEFAULT_SORT
    });
  };

  const activeFilters = [
    ...filterState.categories.map((value) => ({ key: 'categories', value, label: value })),
    ...filterState.brands.map((value) => ({ key: 'brands', value, label: value })),
    ...filterState.deliveryOptions.map((value) => ({ key: 'deliveryOptions', value, label: value })),
    ...filterState.stockOptions.map((value) => ({ key: 'stockOptions', value, label: value })),
    ...(filterState.minRating ? [{ key: 'minRating', value: filterState.minRating, label: `${filterState.minRating} stars & up` }] : []),
    ...(filterState.minPrice || filterState.maxPrice
      ? [
          {
            key: 'priceRange',
            value: `${filterState.minPrice}-${filterState.maxPrice}`,
            label: `Price: ${filterState.minPrice ? formatPrice(filterState.minPrice) : 'Any'} - ${filterState.maxPrice ? formatPrice(filterState.maxPrice) : 'Any'}`
          }
        ]
      : [])
  ];

  const removeActiveFilter = (filter) => {
    if (filter.key === 'minRating') {
      pushFilters({ minRating: '' });
      return;
    }

    if (filter.key === 'priceRange') {
      setPriceDraft({ minPrice: '', maxPrice: '' });
      pushFilters({ minPrice: '', maxPrice: '' });
      return;
    }

    toggleFilterValue(filter.key, filter.value);
  };

  const pagination = catalog.pagination || {};
  const visiblePages = getVisiblePages(pagination.page || 1, pagination.totalPages || 1);
  const hasFiltersApplied = activeFilters.length > 0;

  if (loading) {
    return (
      <section className="page-shell fade-in-up">
        <div className="content-panel">
          <div className="page-header">
            <p className="eyebrow" style={{ background: '#f3f4f6', color: '#374151' }}>
              Electronics Store
            </p>
            <h1 className="page-title">Loading products...</h1>
            <p className="page-subtitle">Preparing filters, pages, and the latest catalog results.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="page-shell fade-in-up">
      <div className="content-panel">
        <div className="page-header">
          <p className="eyebrow" style={{ background: '#f3f4f6', color: '#374151' }}>
            Electronics Store
          </p>
          <h1 className="page-title">
            {filterState.searchQuery ? `Search results for "${filterState.searchQuery}"` : "Today's product picks"}
          </h1>
          <p className="page-subtitle">
            {pagination.total
              ? `Showing ${pagination.from}-${pagination.to} of ${pagination.total} products with category, brand, delivery, price, and rating filters.`
              : 'Use the filter rail to narrow products by the fields already present in your product schema.'}
          </p>
        </div>

        <div className="catalog-shell">
          <aside className="catalog-filters">
            <div className="catalog-filter-card">
              <div className="filter-card-header">
                <h3>Filters</h3>
                {hasFiltersApplied && (
                  <button type="button" className="filter-clear-button" onClick={clearFilters}>
                    Clear all
                  </button>
                )}
              </div>

              <div className="filter-section">
                <h4>Price</h4>
                <form className="price-filter-form" onSubmit={applyPriceFilter}>
                  <input
                    type="number"
                    min="0"
                    value={priceDraft.minPrice}
                    onChange={(event) =>
                      setPriceDraft((current) => ({ ...current, minPrice: event.target.value }))
                    }
                    placeholder={catalog.filters.priceRange.min ? String(catalog.filters.priceRange.min) : 'Min'}
                  />
                  <span>to</span>
                  <input
                    type="number"
                    min="0"
                    value={priceDraft.maxPrice}
                    onChange={(event) =>
                      setPriceDraft((current) => ({ ...current, maxPrice: event.target.value }))
                    }
                    placeholder={catalog.filters.priceRange.max ? String(catalog.filters.priceRange.max) : 'Max'}
                  />
                  <button type="submit" className="btn btn-primary">
                    Apply
                  </button>
                </form>
                <p className="filter-help">
                  Catalog range: {formatPrice(catalog.filters.priceRange.min || 0)} - {formatPrice(catalog.filters.priceRange.max || 0)}
                </p>
              </div>

              <div className="filter-section">
                <h4>Customer Rating</h4>
                <div className="filter-option-list">
                  {RATING_OPTIONS.map((rating) => (
                    <label className="filter-option" key={rating}>
                      <input
                        type="radio"
                        name="rating-filter"
                        checked={String(filterState.minRating) === String(rating)}
                        onChange={() => pushFilters({ minRating: String(rating) })}
                      />
                      <span>{rating} stars & up</span>
                    </label>
                  ))}
                  <label className="filter-option">
                    <input
                      type="radio"
                      name="rating-filter"
                      checked={filterState.minRating === ''}
                      onChange={() => pushFilters({ minRating: '' })}
                    />
                    <span>All ratings</span>
                  </label>
                </div>
              </div>

              <div className="filter-section">
                <h4>Category</h4>
                <div className="filter-option-list">
                  {catalog.filters.categories.map((item) => (
                    <label className="filter-option" key={item.value}>
                      <input
                        type="checkbox"
                        checked={filterState.categories.includes(item.value)}
                        onChange={() => toggleFilterValue('categories', item.value)}
                      />
                      <span>{item.value}</span>
                      <strong>{item.count}</strong>
                    </label>
                  ))}
                </div>
              </div>

              <div className="filter-section">
                <h4>Brand</h4>
                <div className="filter-option-list">
                  {catalog.filters.brands.map((item) => (
                    <label className="filter-option" key={item.value}>
                      <input
                        type="checkbox"
                        checked={filterState.brands.includes(item.value)}
                        onChange={() => toggleFilterValue('brands', item.value)}
                      />
                      <span>{item.value}</span>
                      <strong>{item.count}</strong>
                    </label>
                  ))}
                </div>
              </div>

              <div className="filter-section">
                <h4>Delivery</h4>
                <div className="filter-option-list">
                  {catalog.filters.delivery.map((item) => (
                    <label className="filter-option" key={item.value}>
                      <input
                        type="checkbox"
                        checked={filterState.deliveryOptions.includes(item.value)}
                        onChange={() => toggleFilterValue('deliveryOptions', item.value)}
                      />
                      <span>{item.value}</span>
                      <strong>{item.count}</strong>
                    </label>
                  ))}
                </div>
              </div>

              <div className="filter-section">
                <h4>Availability</h4>
                <div className="filter-option-list">
                  {catalog.filters.stock.map((item) => (
                    <label className="filter-option" key={item.value}>
                      <input
                        type="checkbox"
                        checked={filterState.stockOptions.includes(item.value)}
                        onChange={() => toggleFilterValue('stockOptions', item.value)}
                      />
                      <span>{item.value}</span>
                      <strong>{item.count}</strong>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          <div className="catalog-results">
            <div className="catalog-toolbar">
              <div className="catalog-toolbar-copy">
                <h3>Browse catalog</h3>
                <p>
                  Offset {pagination.offset || 0}, page {pagination.page || 1} of {pagination.totalPages || 1}
                </p>
              </div>

              <div className="catalog-toolbar-controls">
                <label className="catalog-toolbar-field">
                  <span>Sort by</span>
                  <select
                    value={filterState.sort}
                    onChange={(event) => pushFilters({ sort: event.target.value })}
                  >
                    <option value="featured">Featured</option>
                    <option value="newest">Newest arrivals</option>
                    <option value="price_asc">Price: Low to High</option>
                    <option value="price_desc">Price: High to Low</option>
                    <option value="rating_desc">Highest rated</option>
                    <option value="reviews_desc">Most reviewed</option>
                    <option value="title_asc">Name: A to Z</option>
                  </select>
                </label>

                <label className="catalog-toolbar-field">
                  <span>Per page</span>
                  <select
                    value={filterState.limit}
                    onChange={(event) =>
                      pushFilters({ limit: String(event.target.value), page: 1 })
                    }
                  >
                    {PAGE_SIZE_OPTIONS.map((size) => (
                      <option value={size} key={size}>
                        {size}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            </div>

            {hasFiltersApplied && (
              <div className="active-filter-bar">
                {activeFilters.map((filter) => (
                  <button
                    type="button"
                    className="active-filter-chip"
                    key={`${filter.key}-${filter.value}`}
                    onClick={() => removeActiveFilter(filter)}
                  >
                    {filter.label}
                    <span>x</span>
                  </button>
                ))}
              </div>
            )}

            {catalog.products.length > 0 ? (
              <AllProducts products={catalog.products} searchQuery={filterState.searchQuery} />
            ) : (
              <div className="empty-state catalog-empty-actions">
                <h2>No products match these filters.</h2>
                <p>Try broadening the price range, removing a filter, or clearing all filters.</p>
                <div className="empty-action-row">
                  <button type="button" className="btn btn-primary" onClick={clearFilters}>
                    Clear Filters
                  </button>
                  <Link to="/products" className="btn btn-outline-primary">
                    View Full Catalog
                  </Link>
                </div>
              </div>
            )}

            {pagination.totalPages > 1 && (
              <div className="catalog-pagination">
                <button
                  type="button"
                  className="pagination-button"
                  disabled={!pagination.hasPrevPage}
                  onClick={() => pushFilters({ page: pagination.page - 1 }, false)}
                >
                  Previous
                </button>

                {visiblePages[0] > 1 && (
                  <button
                    type="button"
                    className="pagination-button"
                    onClick={() => pushFilters({ page: 1 }, false)}
                  >
                    1
                  </button>
                )}

                {visiblePages[0] > 2 && <span className="pagination-ellipsis">...</span>}

                {visiblePages.map((pageNumber) => (
                  <button
                    type="button"
                    key={pageNumber}
                    className={`pagination-button ${pageNumber === pagination.page ? 'active' : ''}`}
                    onClick={() => pushFilters({ page: pageNumber }, false)}
                  >
                    {pageNumber}
                  </button>
                ))}

                {visiblePages[visiblePages.length - 1] < pagination.totalPages - 1 && (
                  <span className="pagination-ellipsis">...</span>
                )}

                {visiblePages[visiblePages.length - 1] < pagination.totalPages && (
                  <button
                    type="button"
                    className="pagination-button"
                    onClick={() => pushFilters({ page: pagination.totalPages }, false)}
                  >
                    {pagination.totalPages}
                  </button>
                )}

                <button
                  type="button"
                  className="pagination-button"
                  disabled={!pagination.hasNextPage}
                  onClick={() => pushFilters({ page: pagination.page + 1 }, false)}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
