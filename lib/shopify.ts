/**
 * Shopify Storefront API client
 * 
 * Set these environment variables:
 * - NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN
 * - NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN
 */

const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
const storefrontAccessToken = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;

async function shopifyFetch<T>({
  query,
  variables = {},
}: {
  query: string;
  variables?: Record<string, unknown>;
}): Promise<{ data: T }> {
  const endpoint = `https://${domain}/api/2024-01/graphql.json`;
  
  try {
    const result = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': storefrontAccessToken || '',
      },
      body: JSON.stringify({ query, variables }),
      next: { revalidate: 60 }, // Cache for 60 seconds
    });

    if (!result.ok) {
      throw new Error(`Shopify API error: ${result.statusText}`);
    }

    return result.json();
  } catch (error) {
    console.error('Shopify fetch error:', error);
    throw error;
  }
}

// Query fragments
const PRODUCT_FRAGMENT = `
  fragment ProductFragment on Product {
    id
    title
    handle
    description
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
    images(first: 1) {
      edges {
        node {
          url
          altText
        }
      }
    }
    tags
  }
`;

/**
 * Get all products
 */
export async function getProducts(first = 12) {
  const query = `
    ${PRODUCT_FRAGMENT}
    query GetProducts($first: Int!) {
      products(first: $first) {
        edges {
          node {
            ...ProductFragment
          }
        }
      }
    }
  `;

  try {
    const { data } = await shopifyFetch<any>({
      query,
      variables: { first },
    });

    return data.products.edges.map(({ node }: any) => ({
      id: node.id,
      title: node.title,
      handle: node.handle,
      description: node.description,
      price: Math.round(parseFloat(node.priceRange.minVariantPrice.amount) * 100),
      image: node.images.edges[0]?.node.url || '',
      tags: node.tags,
    }));
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

/**
 * Get a single product by handle
 */
export async function getProduct(handle: string) {
  const query = `
    ${PRODUCT_FRAGMENT}
    query GetProduct($handle: String!) {
      product(handle: $handle) {
        ...ProductFragment
        variants(first: 10) {
          edges {
            node {
              id
              title
              availableForSale
              priceV2 {
                amount
                currencyCode
              }
            }
          }
        }
      }
    }
  `;

  try {
    const { data } = await shopifyFetch<any>({
      query,
      variables: { handle },
    });

    if (!data.product) return null;

    const product = data.product;
    return {
      id: product.id,
      title: product.title,
      handle: product.handle,
      description: product.description,
      price: Math.round(parseFloat(product.priceRange.minVariantPrice.amount) * 100),
      image: product.images.edges[0]?.node.url || '',
      tags: product.tags,
      variants: product.variants.edges.map(({ node }: any) => ({
        id: node.id,
        title: node.title,
        available: node.availableForSale,
      })),
    };
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

/**
 * Create a checkout and get the URL
 */
export async function createCheckout(variantId: string, quantity = 1) {
  const query = `
    mutation CreateCheckout($input: CheckoutCreateInput!) {
      checkoutCreate(input: $input) {
        checkout {
          id
          webUrl
        }
        checkoutUserErrors {
          field
          message
        }
      }
    }
  `;

  try {
    const { data } = await shopifyFetch<any>({
      query,
      variables: {
        input: {
          lineItems: [{ variantId, quantity }],
        },
      },
    });

    if (data.checkoutCreate.checkoutUserErrors.length > 0) {
      throw new Error(data.checkoutCreate.checkoutUserErrors[0].message);
    }

    return data.checkoutCreate.checkout.webUrl;
  } catch (error) {
    console.error('Error creating checkout:', error);
    throw error;
  }
}

