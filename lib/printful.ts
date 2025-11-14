/**
 * Printful API client for order fulfillment
 * 
 * Set these environment variables:
 * - PRINTFUL_API_KEY (get from Printful Dashboard > Settings > API)
 */

const PRINTFUL_API_URL = 'https://api.printful.com';
const apiKey = process.env.PRINTFUL_API_KEY;

interface PrintfulAddress {
  name: string;
  company?: string;
  address1: string;
  address2?: string;
  city: string;
  state_code?: string;
  state_name?: string;
  country_code: string;
  zip: string;
  phone?: string;
  email?: string;
}

interface PrintfulItem {
  variant_id: number;
  quantity: number;
  files?: Array<{
    type: 'default' | 'preview' | 'back';
    url: string;
  }>;
  options?: Array<{
    id: string;
    value: string;
  }>;
}

interface CreateOrderRequest {
  external_id: string; // Shopify order ID
  recipient: PrintfulAddress;
  items: PrintfulItem[];
  retail_costs?: {
    currency: string;
    subtotal?: string;
    discount?: string;
    shipping?: string;
    tax?: string;
  };
  confirm?: boolean; // Auto-confirm order
  shipping?: string; // Shipping method ID
}

interface PrintfulOrder {
  id: number;
  external_id: string;
  status: string;
  shipping: string;
  created: number;
  updated: number;
  recipient: PrintfulAddress;
  items: Array<{
    id: number;
    external_id: string;
    variant_id: number;
    quantity: number;
    price: string;
    product: {
      variant_id: number;
      product_id: number;
      image: string;
      name: string;
    };
  }>;
  costs: {
    currency: string;
    subtotal: string;
    discount: string;
    shipping: string;
    tax: string;
    total: string;
  };
  retail_costs: {
    currency: string;
    subtotal: string;
    discount: string;
    shipping: string;
    tax: string;
    total: string;
  };
  shipments?: Array<{
    id: number;
    carrier: string;
    service: string;
    tracking_number: string;
    tracking_url: string;
    created: number;
    ship_date: string;
  }>;
}

async function printfulFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  if (!apiKey) {
    throw new Error('PRINTFUL_API_KEY is not configured');
  }

  const url = `${PRINTFUL_API_URL}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(`Printful API error: ${error.message || response.statusText}`);
  }

  const data = await response.json();
  return data.result as T;
}

/**
 * Create an order in Printful
 */
export async function createPrintfulOrder(
  shopifyOrderId: string,
  recipient: PrintfulAddress,
  items: PrintfulItem[],
  retailCosts?: {
    currency: string;
    subtotal?: string;
    discount?: string;
    shipping?: string;
    tax?: string;
  }
): Promise<PrintfulOrder> {
  const orderData: CreateOrderRequest = {
    external_id: shopifyOrderId,
    recipient,
    items,
    confirm: true, // Auto-confirm to start fulfillment
    ...(retailCosts && { retail_costs: retailCosts }),
  };

  return printfulFetch<PrintfulOrder>('/orders', {
    method: 'POST',
    body: JSON.stringify(orderData),
  });
}

/**
 * Get order status from Printful
 */
export async function getPrintfulOrder(externalId: string): Promise<PrintfulOrder | null> {
  try {
    return await printfulFetch<PrintfulOrder>(`/orders/@${externalId}`);
  } catch (error: any) {
    if (error.message?.includes('404')) {
      return null;
    }
    throw error;
  }
}

/**
 * Get shipping rates from Printful
 */
export async function getShippingRates(
  recipient: PrintfulAddress,
  items: PrintfulItem[]
): Promise<Array<{
  id: string;
  name: string;
  rate: string;
  currency: string;
  minDays: number;
  maxDays: number;
}>> {
  const response = await printfulFetch<{
    code: number;
    result: Array<{
      id: string;
      name: string;
      rate: string;
      currency: string;
      minDays: number;
      maxDays: number;
    }>;
  }>('/shipping/rates', {
    method: 'POST',
    body: JSON.stringify({
      recipient,
      items,
    }),
  });

  return (response as any).result || [];
}

/**
 * Get product variants from Printful catalog
 */
export async function getPrintfulProducts(categoryId?: number) {
  const endpoint = categoryId 
    ? `/store/products?category_id=${categoryId}`
    : '/store/products';
  
  return printfulFetch<Array<{
    id: number;
    type: string;
    brand: string;
    model: string;
    image: string;
    variant_count: number;
    currency: string;
    files: number;
    is_discontinued: boolean;
    is_ignored: boolean;
  }>>(endpoint);
}

/**
 * Get variant details
 */
export async function getPrintfulVariant(variantId: number) {
  return printfulFetch<{
    id: number;
    product_id: number;
    name: string;
    size: string;
    color: string;
    color_code: string;
    availability_status: string;
    availability_regions: string[];
    price: string;
    currency: string;
    files: Array<{
      type: string;
      title: string;
      additional: Array<{
        type: string;
        title: string;
      }>;
    }>;
  }>(`/products/variant/${variantId}`);
}

