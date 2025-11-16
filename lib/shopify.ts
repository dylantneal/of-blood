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
  // Validate environment variables
  if (!domain) {
    throw new Error(
      'NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN is not set. Please add it to your .env.local file.'
    );
  }

  if (!storefrontAccessToken) {
    throw new Error(
      'NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN is not set. Please add it to your .env.local file.'
    );
  }

  const endpoint = `https://${domain}/api/2024-01/graphql.json`;
  
  try {
    const result = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': storefrontAccessToken,
      },
      body: JSON.stringify({ query, variables }),
      next: { revalidate: 60 }, // Cache for 60 seconds
    });

    if (!result.ok) {
      const errorText = await result.text();
      let errorMessage = `Shopify API error (${result.status}): ${result.statusText}`;
      
      try {
        const errorJson = JSON.parse(errorText);
        if (errorJson.errors && errorJson.errors.length > 0) {
          const errorDetails = errorJson.errors.map((e: any) => e.message).join(', ');
          errorMessage = `Shopify API error (${result.status}): ${errorDetails}`;
        } else if (errorJson.message) {
          errorMessage = `Shopify API error (${result.status}): ${errorJson.message}`;
        }
      } catch {
        // If parsing fails, use the text as-is
        if (errorText) {
          errorMessage += `\nResponse: ${errorText.substring(0, 200)}`;
        }
      }
      
      // Add more context for debugging
      if (result.status === 401) {
        errorMessage += '\n\n🔴 This means your Storefront API token is incorrect, expired, or missing.';
        errorMessage += '\n\nTo fix:';
        errorMessage += '\n1. Go to Shopify Admin → Settings → Apps and sales channels → Develop apps';
        errorMessage += '\n2. Click your app → API credentials tab';
        errorMessage += '\n3. Find "Storefront API" section (NOT "Admin API")';
        errorMessage += '\n4. Click "Reveal token once" and copy it';
        errorMessage += '\n5. Make sure it starts with "shpat_"';
        errorMessage += '\n6. Update NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN in .env.local';
      } else if (result.status === 403) {
        errorMessage += '\n\n🔴 This means your Storefront API token doesn\'t have the required permissions.';
        errorMessage += '\n\nTo fix:';
        errorMessage += '\n1. Go to your app → Configuration tab';
        errorMessage += '\n2. Scroll to "Storefront API" section';
        errorMessage += '\n3. Enable these scopes:';
        errorMessage += '\n   - unauthenticated_read_product_listings';
        errorMessage += '\n   - unauthenticated_read_product_inventory';
        errorMessage += '\n   - unauthenticated_write_checkouts';
        errorMessage += '\n4. Click Save, then get a new token';
      } else if (result.status === 404) {
        errorMessage += '\n\n🔴 This means your store domain is incorrect.';
        errorMessage += '\n\nTo fix: Check that NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN is correct (e.g., your-store.myshopify.com)';
      }
      
      throw new Error(errorMessage);
    }

    const response = await result.json();
    
    // Check for GraphQL errors
    if (response.errors) {
      throw new Error(
        `Shopify GraphQL error: ${response.errors.map((e: any) => e.message).join(', ')}`
      );
    }

    return response;
  } catch (error: any) {
    // Provide more helpful error messages
    if (error.message.includes('fetch failed')) {
      throw new Error(
        `Failed to connect to Shopify. Please check:\n` +
        `1. NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN is correct (e.g., your-store.myshopify.com)\n` +
        `2. Your internet connection\n` +
        `3. The Shopify store is accessible\n\n` +
        `Original error: ${error.message}`
      );
    }
    
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

    const products = data.products.edges.map(({ node }: any) => ({
      id: node.id,
      title: node.title,
      handle: node.handle,
      description: node.description,
      price: Math.round(parseFloat(node.priceRange.minVariantPrice.amount) * 100),
      image: node.images.edges[0]?.node.url || '',
      tags: node.tags,
    }));

    return products;
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

/**
 * Get a single product by handle with full details
 */
export async function getProduct(handle: string) {
  const query = `
    query GetProduct($handle: String!) {
      product(handle: $handle) {
        id
        title
        handle
        description
        descriptionHtml
        priceRange {
          minVariantPrice {
            amount
            currencyCode
          }
          maxVariantPrice {
            amount
            currencyCode
          }
        }
        images(first: 10) {
          edges {
            node {
              id
              url
              altText
              width
              height
            }
          }
        }
        tags
        variants(first: 50) {
          edges {
            node {
              id
              title
              availableForSale
              price {
                amount
                currencyCode
              }
              selectedOptions {
                name
                value
              }
              image {
                url
                altText
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
      descriptionHtml: product.descriptionHtml,
      price: Math.round(parseFloat(product.priceRange.minVariantPrice.amount) * 100),
      priceMax: Math.round(parseFloat(product.priceRange.maxVariantPrice.amount) * 100),
      images: product.images.edges.map(({ node }: any) => ({
        id: node.id,
        url: node.url,
        altText: node.altText,
        width: node.width,
        height: node.height,
      })),
      image: product.images.edges[0]?.node.url || '',
      tags: product.tags,
      variants: product.variants.edges.map(({ node }: any) => ({
        id: node.id,
        title: node.title,
        available: node.availableForSale,
        price: Math.round(parseFloat(node.price.amount) * 100),
        selectedOptions: node.selectedOptions,
        image: node.image?.url || product.images.edges[0]?.node.url || '',
      })),
    };
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

/**
 * Create a cart
 */
export async function createCart() {
  const query = `
    mutation cartCreate {
      cartCreate {
        cart {
          id
          checkoutUrl
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  try {
    const { data } = await shopifyFetch<any>({ query });
    
    if (data.cartCreate.userErrors.length > 0) {
      throw new Error(data.cartCreate.userErrors[0].message);
    }

    return data.cartCreate.cart;
  } catch (error) {
    console.error('Error creating cart:', error);
    throw error;
  }
}

/**
 * Get cart by ID
 */
export async function getCart(cartId: string) {
  const query = `
    query getCart($id: ID!) {
      cart(id: $id) {
        id
        checkoutUrl
        totalQuantity
        cost {
          totalAmount {
            amount
            currencyCode
          }
          subtotalAmount {
            amount
            currencyCode
          }
        }
        lines(first: 100) {
          edges {
            node {
              id
              quantity
              merchandise {
                ... on ProductVariant {
                  id
                  title
                  image {
                    url
                    altText
                  }
                  price {
                    amount
                    currencyCode
                  }
                  product {
                    id
                    title
                    handle
                    images(first: 1) {
                      edges {
                        node {
                          url
                          altText
                        }
                      }
                    }
                  }
                }
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
      variables: { id: cartId },
    });

    return data.cart;
  } catch (error) {
    console.error('Error fetching cart:', error);
    throw error;
  }
}

/**
 * Add items to cart
 */
export async function addToCart(cartId: string, variantId: string, quantity: number) {
  const query = `
    mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
      cartLinesAdd(cartId: $cartId, lines: $lines) {
        cart {
          id
          checkoutUrl
          totalQuantity
          cost {
            totalAmount {
              amount
              currencyCode
            }
          }
          lines(first: 100) {
            edges {
              node {
                id
                quantity
                merchandise {
                  ... on ProductVariant {
                    id
                    title
                    image {
                      url
                      altText
                    }
                    price {
                      amount
                      currencyCode
                    }
                    product {
                      id
                      title
                      handle
                      images(first: 1) {
                        edges {
                          node {
                            url
                            altText
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
        userErrors {
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
        cartId,
        lines: [{ merchandiseId: variantId, quantity }],
      },
    });

    if (data.cartLinesAdd.userErrors.length > 0) {
      throw new Error(data.cartLinesAdd.userErrors[0].message);
    }

    return data.cartLinesAdd.cart;
  } catch (error) {
    console.error('Error adding to cart:', error);
    throw error;
  }
}

/**
 * Update cart line item
 */
export async function updateCartLine(cartId: string, lineId: string, quantity: number) {
  const query = `
    mutation cartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
      cartLinesUpdate(cartId: $cartId, lines: $lines) {
        cart {
          id
          checkoutUrl
          totalQuantity
          cost {
            totalAmount {
              amount
              currencyCode
            }
          }
          lines(first: 100) {
            edges {
              node {
                id
                quantity
                merchandise {
                  ... on ProductVariant {
                    id
                    title
                    image {
                      url
                      altText
                    }
                    price {
                      amount
                      currencyCode
                    }
                    product {
                      id
                      title
                      handle
                      images(first: 1) {
                        edges {
                          node {
                            url
                            altText
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
        userErrors {
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
        cartId,
        lines: [{ id: lineId, quantity }],
      },
    });

    if (data.cartLinesUpdate.userErrors.length > 0) {
      console.error('[Shopify] Update error:', data.cartLinesUpdate.userErrors);
      throw new Error(data.cartLinesUpdate.userErrors[0].message);
    }

    return data.cartLinesUpdate.cart;
  } catch (error) {
    console.error('[Shopify] Error updating cart:', error);
    throw error;
  }
}

/**
 * Remove line from cart
 */
export async function removeCartLine(cartId: string, lineId: string) {
  const query = `
    mutation cartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
      cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
        cart {
          id
          checkoutUrl
          totalQuantity
          cost {
            totalAmount {
              amount
              currencyCode
            }
          }
          lines(first: 100) {
            edges {
              node {
                id
                quantity
                merchandise {
                  ... on ProductVariant {
                    id
                    title
                    image {
                      url
                      altText
                    }
                    price {
                      amount
                      currencyCode
                    }
                    product {
                      id
                      title
                      handle
                      images(first: 1) {
                        edges {
                          node {
                            url
                            altText
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
        userErrors {
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
        cartId,
        lineIds: [lineId],
      },
    });

    if (data.cartLinesRemove.userErrors.length > 0) {
      console.error('[Shopify] Remove error:', data.cartLinesRemove.userErrors);
      throw new Error(data.cartLinesRemove.userErrors[0].message);
    }

    return data.cartLinesRemove.cart;
  } catch (error) {
    console.error('[Shopify] Error removing from cart:', error);
    throw error;
  }
}

/**
 * Create a checkout and get the URL (legacy - for backwards compatibility)
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

