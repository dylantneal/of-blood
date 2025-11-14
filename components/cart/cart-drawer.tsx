"use client";

import { useCart } from "@/contexts/cart-context";
import { formatPrice } from "@/lib/utils";
import { ShoppingBag, Plus, Minus, X } from "lucide-react";
import Link from "next/link";

interface TestProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartDrawer({ isOpen, onClose }: TestProps) {
  const { cart, isLoading, updateItem, removeItem, refreshCart } = useCart();
  
  const handleUpdateQuantity = async (lineId: string, newQuantity: number) => {
    try {
      await updateItem(lineId, newQuantity);
      await refreshCart();
    } catch (error) {
      console.error('Failed to update quantity:', error);
      alert('Failed to update quantity. Please try again.');
    }
  };

  const handleRemove = async (lineId: string) => {
    try {
      await removeItem(lineId);
      await refreshCart();
    } catch (error) {
      console.error('Failed to remove item:', error);
      alert('Failed to remove item. Please try again.');
    }
  };
  
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(4px)',
          zIndex: 100,
          transition: 'opacity 0.3s',
        }}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        style={{
          position: 'fixed',
          right: 0,
          top: 0,
          height: '100vh',
          width: '100%',
          maxWidth: '28rem',
          backgroundColor: '#0A0A0A',
          borderLeft: '1px solid #2A2A2A',
          boxShadow: '-4px 0 24px rgba(0, 0, 0, 0.5)',
          zIndex: 101,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Header - Fixed */}
        <div style={{ 
          padding: '24px', 
          borderBottom: '1px solid #2A2A2A', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          flexShrink: 0,
          backgroundColor: '#0A0A0A',
        }}>
          <h2 style={{ 
            fontSize: '24px', 
            fontWeight: 'bold', 
            color: '#F2F2F2',
            fontFamily: 'var(--font-display), serif',
            letterSpacing: '0.05em',
          }}>
            Cart
          </h2>
          <button
            onClick={onClose}
            style={{ 
              padding: '8px', 
              backgroundColor: 'transparent',
              border: 'none', 
              color: '#F2F2F2', 
              cursor: 'pointer',
              borderRadius: '4px',
              transition: 'background-color 0.3s',
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#1A1A1A'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <X style={{ width: '20px', height: '20px' }} />
          </button>
        </div>

        {/* Content - Scrollable */}
        <div style={{ 
          padding: '24px', 
          flex: 1, 
          overflowY: 'auto',
          overflowX: 'hidden',
          position: 'relative',
        }}>
          {/* Loading Overlay */}
          {isLoading && (
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(10, 10, 10, 0.8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 10,
            }}>
              <div style={{ color: '#C9A227', fontSize: '16px' }}>Updating cart...</div>
            </div>
          )}
          
          {isLoading && !cart ? (
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              padding: '48px 0',
              color: '#666'
            }}>
              Loading...
            </div>
          ) : !cart || !cart.items || cart.items.length === 0 ? (
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center', 
              padding: '48px 0',
              textAlign: 'center'
            }}>
              <ShoppingBag style={{ width: '64px', height: '64px', color: '#333', marginBottom: '16px' }} />
              <p style={{ 
                fontSize: '20px', 
                fontWeight: 'bold', 
                marginBottom: '8px',
                color: '#F2F2F2',
                fontFamily: 'var(--font-display), serif'
              }}>
                Your cart is empty
              </p>
              <p style={{ color: '#999', marginBottom: '24px' }}>
                Add some items to get started
              </p>
              <Link 
                href="/merch" 
                onClick={onClose}
                style={{
                  padding: '12px 32px',
                  backgroundColor: '#B30A0A',
                  color: '#F2F2F2',
                  textDecoration: 'none',
                  borderRadius: '4px',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  border: '1px solid rgba(179, 10, 10, 0.5)',
                  display: 'inline-block',
                }}
              >
                Browse Merch
              </Link>
            </div>
          ) : (
            <div>
              {cart.items.map((item, idx) => (
                <div
                  key={item.id || idx}
                  style={{
                    backgroundColor: 'rgba(26, 26, 26, 0.5)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid #2A2A2A',
                    borderRadius: '4px',
                    padding: '16px',
                    marginBottom: '16px',
                  }}
                >
                  <div style={{ display: 'flex', gap: '16px' }}>
                    {/* Image */}
                    <Link
                      href={`/merch/${item.handle}`}
                      onClick={onClose}
                      style={{ textDecoration: 'none' }}
                    >
                      <div style={{ 
                        width: '80px', 
                        height: '80px', 
                        backgroundColor: '#2A2A2A', 
                        borderRadius: '4px', 
                        flexShrink: 0,
                        overflow: 'hidden',
                      }}>
                        {item.image ? (
                          <img 
                            src={item.image} 
                            alt={item.title} 
                            style={{ 
                              width: '100%', 
                              height: '100%', 
                              objectFit: 'cover',
                              transition: 'transform 0.3s',
                            }} 
                          />
                        ) : (
                          <div style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center', 
                            height: '100%', 
                            color: '#C9A227',
                            opacity: 0.3,
                            fontFamily: 'var(--font-display), serif',
                            fontSize: '12px',
                          }}>
                            OB
                          </div>
                        )}
                      </div>
                    </Link>
                    
                    {/* Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <Link
                        href={`/merch/${item.handle}`}
                        onClick={onClose}
                        style={{
                          fontWeight: '600',
                          marginBottom: '4px',
                          color: '#F2F2F2',
                          textDecoration: 'none',
                          display: 'block',
                          fontFamily: 'var(--font-display), serif',
                          transition: 'color 0.3s',
                        }}
                        onMouseOver={(e) => e.currentTarget.style.color = '#B30A0A'}
                        onMouseOut={(e) => e.currentTarget.style.color = '#F2F2F2'}
                      >
                        {item.title}
                      </Link>
                      <div style={{ fontSize: '14px', color: '#999', marginBottom: '8px' }}>{item.variantTitle}</div>
                      <div style={{ 
                        color: '#C9A227', 
                        fontFamily: 'monospace',
                        marginBottom: '12px',
                        fontSize: '14px',
                      }}>
                        {formatPrice(item.price)}
                      </div>

                      {/* Quantity Controls */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <button
                          onClick={() => {
                            console.log('[Cart] Decrease clicked for item:', item.id, 'current qty:', item.quantity);
                            if (item.quantity > 1) {
                              handleUpdateQuantity(item.id, item.quantity - 1);
                            } else {
                              handleRemove(item.id);
                            }
                          }}
                          disabled={isLoading}
                          style={{
                            padding: '4px',
                            backgroundColor: 'transparent',
                            border: '1px solid #2A2A2A',
                            borderRadius: '4px',
                            color: '#F2F2F2',
                            cursor: isLoading ? 'not-allowed' : 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'background-color 0.3s',
                            opacity: isLoading ? 0.5 : 1,
                          }}
                          onMouseOver={(e) => !isLoading && (e.currentTarget.style.backgroundColor = '#1A1A1A')}
                          onMouseOut={(e) => !isLoading && (e.currentTarget.style.backgroundColor = 'transparent')}
                          aria-label="Decrease quantity"
                        >
                          <Minus style={{ width: '16px', height: '16px' }} />
                        </button>
                        
                        <span style={{ 
                          width: '32px', 
                          textAlign: 'center', 
                          fontFamily: 'monospace',
                          fontSize: '14px',
                          color: '#F2F2F2',
                        }}>
                          {item.quantity}
                        </span>
                        
                        <button
                          onClick={() => {
                            console.log('[Cart] Increase clicked for item:', item.id, 'current qty:', item.quantity);
                            handleUpdateQuantity(item.id, item.quantity + 1);
                          }}
                          disabled={isLoading}
                          style={{
                            padding: '4px',
                            backgroundColor: 'transparent',
                            border: '1px solid #2A2A2A',
                            borderRadius: '4px',
                            color: '#F2F2F2',
                            cursor: isLoading ? 'not-allowed' : 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'background-color 0.3s',
                            opacity: isLoading ? 0.5 : 1,
                          }}
                          onMouseOver={(e) => !isLoading && (e.currentTarget.style.backgroundColor = '#1A1A1A')}
                          onMouseOut={(e) => !isLoading && (e.currentTarget.style.backgroundColor = 'transparent')}
                          aria-label="Increase quantity"
                        >
                          <Plus style={{ width: '16px', height: '16px' }} />
                        </button>
                        
                        <button
                          onClick={() => {
                            console.log('[Cart] Remove clicked for item:', item.id);
                            handleRemove(item.id);
                          }}
                          disabled={isLoading}
                          style={{
                            marginLeft: 'auto',
                            padding: '4px 8px',
                            backgroundColor: 'transparent',
                            border: 'none',
                            color: '#666',
                            cursor: isLoading ? 'not-allowed' : 'pointer',
                            fontSize: '12px',
                            transition: 'color 0.3s',
                            opacity: isLoading ? 0.5 : 1,
                          }}
                          onMouseOver={(e) => !isLoading && (e.currentTarget.style.color = '#B30A0A')}
                          onMouseOut={(e) => !isLoading && (e.currentTarget.style.color = '#666')}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer - Total & Checkout (Fixed at bottom when items exist) */}
        {cart && cart.items && cart.items.length > 0 && (
          <div style={{
            borderTop: '1px solid #2A2A2A',
            padding: '24px',
            backgroundColor: '#0A0A0A',
            flexShrink: 0,
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '16px',
              fontSize: '18px',
            }}>
              <span style={{ 
                fontWeight: '600',
                color: '#F2F2F2',
                fontFamily: 'var(--font-display), serif',
              }}>
                Total
              </span>
              <span style={{ 
                color: '#C9A227',
                fontFamily: 'monospace',
                fontWeight: 'bold',
                fontSize: '20px',
              }}>
                {formatPrice(cart.totalAmount)}
              </span>
            </div>
            
            <button
              onClick={() => {
                if (cart?.checkoutUrl) {
                  window.location.href = cart.checkoutUrl;
                }
              }}
              style={{
                width: '100%',
                padding: '16px',
                backgroundColor: '#B30A0A',
                color: '#F2F2F2',
                border: '1px solid rgba(179, 10, 10, 0.5)',
                borderRadius: '4px',
                fontSize: '14px',
                fontWeight: 'bold',
                cursor: 'pointer',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                fontFamily: 'var(--font-display), serif',
                transition: 'all 0.3s',
                boxShadow: '0 0 0 rgba(179, 10, 10, 0)',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(179, 10, 10, 0.9)';
                e.currentTarget.style.boxShadow = '0 0 30px rgba(179, 10, 10, 0.6)';
                e.currentTarget.style.transform = 'scale(1.02)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = '#B30A0A';
                e.currentTarget.style.boxShadow = '0 0 0 rgba(179, 10, 10, 0)';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              Checkout
            </button>
            
            <button
              onClick={onClose}
              style={{
                width: '100%',
                marginTop: '12px',
                padding: '12px',
                backgroundColor: 'transparent',
                color: '#999',
                border: '1px solid #2A2A2A',
                borderRadius: '4px',
                fontSize: '14px',
                cursor: 'pointer',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                fontFamily: 'var(--font-display), serif',
                transition: 'all 0.3s',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#1A1A1A';
                e.currentTarget.style.color = '#F2F2F2';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = '#999';
              }}
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  );
}

