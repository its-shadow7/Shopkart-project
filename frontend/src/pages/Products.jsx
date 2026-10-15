import { useState, useEffect } from 'react'
import { api } from '../services/api'
import Navbar from '../components/Navbar'
import ProductCard from '../components/ProductCard'
import SearchBar from '../components/SearchBar'
import Pagination from '../components/Pagination'

function Products() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [sort, setSort] = useState('')

  // Pagination states
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(8)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)

  // Current user's wishlisted product IDs
  const [wishlistIds, setWishlistIds] = useState(new Set())

  const fetchWishlistIds = async () => {
    try {
      const response = await api.get('/wishlist')
      const ids = new Set((response.data.wishlist || []).map((item) => item._id))
      setWishlistIds(ids)
    } catch {
      // Guest or session error
    }
  }

  useEffect(() => {
    fetchWishlistIds()
  }, [])

  const fetchProducts = async () => {
    setLoading(true)
    setError('')

    try {
      const params = { page, limit }
      if (search.trim()) params.search = search.trim()
      if (category && category !== 'All') params.category = category
      if (sort) params.sort = sort

      const response = await api.get('/products', { params })
      setProducts(response.data.products || [])
      setTotalPages(response.data.totalPages || 1)
      setTotal(response.data.total ?? (response.data.products?.length || 0))
    } catch (err) {
      console.error('Failed to fetch products:', err)
      setError('Something went wrong while loading products.')
    } finally {
      setLoading(false)
    }
  }

  // Reset to page 1 whenever search, category, or sort changes
  useEffect(() => {
    setPage(1)
  }, [search, category, sort])

  // Fetch when search, category, sort, page, or limit changes
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchProducts()
    }, 250) // 250ms debounce for smooth typing

    return () => clearTimeout(delayDebounce)
  }, [search, category, sort, page, limit])

  const handleResetFilters = () => {
    setSearch('')
    setCategory('All')
    setSort('')
    setPage(1)
  }

  const handlePageChange = (newPage) => {
    setPage(newPage)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleLimitChange = (newLimit) => {
    setLimit(newLimit)
    setPage(1)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="mx-auto max-w-6xl px-4 sm:px-6 py-8">
        
        {/* Page Header */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Product Discovery
            </h1>
            <p className="text-sm text-slate-500">
              Browse, search, and discover the best products on ShopKart.
            </p>
          </div>

          <span className="text-xs font-semibold text-slate-400 self-start sm:self-auto">
            {total} {total === 1 ? 'Product' : 'Products'} found
          </span>
        </div>

        {/* Search & Filter Bar */}
        <div className="mb-8">
          <SearchBar
            search={search}
            setSearch={setSearch}
            category={category}
            setCategory={setCategory}
            sort={sort}
            setSort={setSort}
          />
        </div>

        {/* 1. Loading State */}
        {loading && (
          <div className="flex min-h-[300px] flex-col items-center justify-center rounded-3xl border border-slate-100 bg-white p-12 text-center shadow-xs">
            <div className="h-9 w-9 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
            <p className="mt-4 text-sm font-medium text-slate-600">
              Loading products...
            </p>
          </div>
        )}

        {/* 2. Error State */}
        {!loading && error && (
          <div className="flex min-h-[300px] flex-col items-center justify-center rounded-3xl border border-red-100 bg-white p-12 text-center shadow-xs">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-600">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="mt-4 text-base font-semibold text-slate-900">{error}</h3>
            <p className="mt-1 text-xs text-slate-500">Please check your network or try again.</p>
            <button
              onClick={fetchProducts}
              className="mt-5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-indigo-700 cursor-pointer"
            >
              Retry
            </button>
          </div>
        )}

        {/* 3. Empty State */}
        {!loading && !error && products.length === 0 && (
          <div className="flex min-h-[300px] flex-col items-center justify-center rounded-3xl border border-slate-100 bg-white p-12 text-center shadow-xs">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <h3 className="mt-4 text-base font-semibold text-slate-900">
              No products found.
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              Try adjusting your search or category filters to find what you're looking for.
            </p>
            {(search || category !== 'All' || sort) && (
              <button
                onClick={handleResetFilters}
                className="mt-5 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                Clear Filters
              </button>
            )}
          </div>
        )}

        {/* Products Grid & Pagination */}
        {!loading && !error && products.length > 0 && (
          <>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {products.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  initialWishlisted={wishlistIds.has(product._id)}
                  onWishlistChange={(productId, isWishlisted) => {
                    setWishlistIds((prev) => {
                      const next = new Set(prev)
                      if (isWishlisted) next.add(productId)
                      else next.delete(productId)
                      return next
                    })
                  }}
                />
              ))}
            </div>

            <Pagination
              page={page}
              totalPages={totalPages}
              total={total}
              limit={limit}
              onPageChange={handlePageChange}
              onLimitChange={handleLimitChange}
            />
          </>
        )}

      </main>
    </div>
  )
}

export default Products
