import { useState } from 'react';
import { Edit2, Save, X } from 'lucide-react';
import { cn } from '@/utils/cn';
import { formatThreadDate } from '@/utils/formatters';
import { Button } from '@/components/ui';
import { Select } from '@/components/ui';
import { useAppStore } from '@/store/appStore';
import type { Order, Zone, Restaurant } from '@/types';

interface OrderCardProps {
  order: Order;
  zones: Zone[];
  restaurants: Restaurant[];
}

export function OrderCard({ order, zones, restaurants }: OrderCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedStatus, setEditedStatus] = useState(order.status);
  const [editedPaymentStatus, setEditedPaymentStatus] = useState(order.payment.status);
  const [editedPaymentMethod, setEditedPaymentMethod] = useState(order.payment.method);
  const updateOrder = useAppStore(state => state.updateOrder);
  const isUpdatingOrder = useAppStore(state => state.isUpdatingOrder);

  // Find restaurant and zone names
  const restaurant = restaurants.find(r => r.restaurant_id === order.restaurant_id);
  const zone = zones.find(z => z.zone_id === order.zone_id);

  const restaurantName = restaurant?.name || 'Unknown Restaurant';
  const zoneName = zone?.name || 'Unknown Zone';

  // Status badge colors
  const statusColors: Record<string, string> = {
    placed: 'bg-blue-100 text-blue-800',
    confirmed: 'bg-green-100 text-green-800',
    in_transit: 'bg-yellow-100 text-yellow-800',
    delivered: 'bg-gray-100 text-gray-800',
    cancelled: 'bg-red-100 text-red-800',
    refunded: 'bg-purple-100 text-purple-800',
  };

  // Payment status colors
  const paymentStatusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    completed: 'bg-green-100 text-green-800',
    failed: 'bg-red-100 text-red-800',
    refunded: 'bg-purple-100 text-purple-800',
  };

  const handleSave = async () => {
    try {
      await updateOrder(order.order_id, {
        status: editedStatus,
        payment: {
          amount: order.payment.amount,
          method: editedPaymentMethod,
          status: editedPaymentStatus,
        },
      });
      setIsEditing(false);
    } catch (error) {
      // Error handling is done in store
    }
  };

  const handleCancel = () => {
    setEditedStatus(order.status);
    setEditedPaymentStatus(order.payment.status);
    setEditedPaymentMethod(order.payment.method);
    setIsEditing(false);
  };

  const statusOptions = [
    { value: 'placed', label: 'Placed' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'in_transit', label: 'In Transit' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'cancelled', label: 'Cancelled' },
    { value: 'refunded', label: 'Refunded' },
  ];

  const paymentStatusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'completed', label: 'Completed' },
    { value: 'failed', label: 'Failed' },
    { value: 'refunded', label: 'Refunded' },
  ];

  const paymentMethodOptions = [
    { value: 'credit_card', label: 'Credit Card' },
    { value: 'debit_card', label: 'Debit Card' },
    { value: 'wallet', label: 'Wallet' },
    { value: 'cash', label: 'Cash' },
    { value: 'upi', label: 'UPI' },
    { value: 'net_banking', label: 'Net Banking' },
  ];

  return (
    <div className="p-5 rounded-xl border-2 border-zinc-200 bg-white transition-all duration-200 hover:shadow-lg">
      {/* Header with Order ID and Edit button */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-zinc-900">Order #{order.order_id.slice(0, 8)}</h3>
          <p className="text-xs text-zinc-500 mt-1">{formatThreadDate(order.created_at)}</p>
        </div>
        {!isEditing && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsEditing(true)}
            aria-label="Edit order"
            className="h-8 w-8"
          >
            <Edit2 className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Order Details */}
      <div className="space-y-3">
        {/* Restaurant */}
        <div>
          <span className="text-xs text-zinc-500">Restaurant:</span>
          <p className="text-sm font-medium text-zinc-900">{restaurantName}</p>
        </div>

        {/* Zone */}
        <div>
          <span className="text-xs text-zinc-500">Zone:</span>
          <p className="text-sm font-medium text-zinc-900">{zoneName}</p>
        </div>

        {/* Items */}
        <div>
          <span className="text-xs text-zinc-500">Items:</span>
          <p className="text-sm font-medium text-zinc-900">
            {order.item_name} x {order.item_quantity}
          </p>
        </div>

        {/* Status */}
        <div>
          <span className="text-xs text-zinc-500">Status:</span>
          {isEditing ? (
            <Select
              value={editedStatus}
              onChange={(e) => setEditedStatus(e.target.value)}
              options={statusOptions}
              className="mt-1"
            />
          ) : (
            <span
              className={cn(
                'inline-block px-2.5 py-1 rounded-md text-xs font-medium capitalize mt-1',
                statusColors[order.status] || statusColors.placed
              )}
            >
              {order.status}
            </span>
          )}
        </div>

        {/* Payment Method */}
        <div>
          <span className="text-xs text-zinc-500">Payment Method:</span>
          {isEditing ? (
            <Select
              value={editedPaymentMethod}
              onChange={(e) => setEditedPaymentMethod(e.target.value)}
              options={paymentMethodOptions}
              className="mt-1"
            />
          ) : (
            <p className="text-sm font-medium text-zinc-900 capitalize mt-1">
              {order.payment.method.replace(/_/g, ' ')}
            </p>
          )}
        </div>

        {/* Payment Status */}
        <div>
          <span className="text-xs text-zinc-500">Payment Status:</span>
          {isEditing ? (
            <Select
              value={editedPaymentStatus}
              onChange={(e) => setEditedPaymentStatus(e.target.value)}
              options={paymentStatusOptions}
              className="mt-1"
            />
          ) : (
            <span
              className={cn(
                'inline-block px-2.5 py-1 rounded-md text-xs font-medium capitalize mt-1',
                paymentStatusColors[order.payment.status] || paymentStatusColors.pending
              )}
            >
              {order.payment.status}
            </span>
          )}
        </div>

        {/* Amount */}
        <div>
          <span className="text-xs text-zinc-500">Amount:</span>
          <p className="text-lg font-semibold text-zinc-900">
            ₹{order.total_amount.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Edit Actions */}
      {isEditing && (
        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-zinc-200">
          <Button
            variant="default"
            size="sm"
            onClick={handleSave}
            disabled={isUpdatingOrder}
            className="flex-1"
          >
            <Save className="w-4 h-4 mr-2" />
            Save
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={handleCancel}
            disabled={isUpdatingOrder}
            className="flex-1"
          >
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>
        </div>
      )}
    </div>
  );
}
