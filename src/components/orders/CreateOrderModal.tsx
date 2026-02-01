import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui';
import { Input } from '@/components/ui';
import { Select } from '@/components/ui';
import { useAppStore } from '@/store/appStore';
import type { Zone, Restaurant } from '@/types';

interface CreateOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateOrderModal({ isOpen, onClose }: CreateOrderModalProps) {
  const userId = useAppStore(state => state.userId);
  const zones = useAppStore(state => state.zones);
  const restaurants = useAppStore(state => state.restaurants);
  const isLoadingZones = useAppStore(state => state.isLoadingZones);
  const isLoadingRestaurants = useAppStore(state => state.isLoadingRestaurants);
  const isCreatingOrder = useAppStore(state => state.isCreatingOrder);
  const fetchZones = useAppStore(state => state.fetchZones);
  const fetchRestaurants = useAppStore(state => state.fetchRestaurants);
  const createOrder = useAppStore(state => state.createOrder);

  const [selectedZoneId, setSelectedZoneId] = useState<string>('');
  const [selectedRestaurantId, setSelectedRestaurantId] = useState<string>('');
  const [itemName, setItemName] = useState('');
  const [itemQuantity, setItemQuantity] = useState<number>(1);
  const [itemPrice, setItemPrice] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [estimatedDelivery, setEstimatedDelivery] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Fetch zones on mount
  useEffect(() => {
    if (isOpen && zones.length === 0) {
      fetchZones();
    }
  }, [isOpen, zones.length, fetchZones]);

  // Fetch restaurants when zone is selected
  useEffect(() => {
    if (selectedZoneId) {
      fetchRestaurants(selectedZoneId);
      // Clear restaurant selection when zone changes
      setSelectedRestaurantId('');
    } else {
      setSelectedRestaurantId('');
    }
  }, [selectedZoneId, fetchRestaurants]);

  // Calculate total amount
  const totalAmount = itemPrice * itemQuantity;

  // Filter restaurants by selected zone
  const filteredRestaurants = selectedZoneId
    ? restaurants.filter(r => r.location.zone_id === selectedZoneId)
    : [];

  // Payment method options
  const paymentMethodOptions = [
    { value: 'credit_card', label: 'Credit Card' },
    { value: 'debit_card', label: 'Debit Card' },
    { value: 'wallet', label: 'Wallet' },
    { value: 'cash', label: 'Cash' },
    { value: 'upi', label: 'UPI' },
    { value: 'net_banking', label: 'Net Banking' },
  ];

  // Zone options
  const zoneOptions = zones.map(zone => ({
    value: zone.zone_id,
    label: `${zone.name} (${zone.city})`,
  }));

  // Restaurant options
  const restaurantOptions = filteredRestaurants.map(restaurant => ({
    value: restaurant.restaurant_id,
    label: restaurant.name,
  }));

  // Generate default estimated delivery (1 hour from now)
  useEffect(() => {
    if (isOpen && !estimatedDelivery) {
      const now = new Date();
      now.setHours(now.getHours() + 1);
      const isoString = now.toISOString().slice(0, 16); // Format: YYYY-MM-DDTHH:mm
      setEstimatedDelivery(isoString);
    }
  }, [isOpen, estimatedDelivery]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!selectedZoneId) {
      newErrors.zone = 'Zone is required';
    }
    if (!selectedRestaurantId) {
      newErrors.restaurant = 'Restaurant is required';
    }
    if (!itemName.trim()) {
      newErrors.itemName = 'Item name is required';
    }
    if (itemQuantity <= 0) {
      newErrors.itemQuantity = 'Quantity must be greater than 0';
    }
    if (itemPrice < 0) {
      newErrors.itemPrice = 'Price must be 0 or greater';
    }
    if (!paymentMethod) {
      newErrors.paymentMethod = 'Payment method is required';
    }
    if (!estimatedDelivery) {
      newErrors.estimatedDelivery = 'Estimated delivery is required';
    }

    // Validate restaurant belongs to selected zone
    if (selectedZoneId && selectedRestaurantId) {
      const restaurant = restaurants.find(r => r.restaurant_id === selectedRestaurantId);
      if (restaurant && restaurant.location.zone_id !== selectedZoneId) {
        newErrors.restaurant = 'Selected restaurant does not belong to the selected zone';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm() || !userId) {
      return;
    }

    try {
      // Convert estimated delivery to ISO format
      const estimatedDeliveryISO = new Date(estimatedDelivery).toISOString();

      await createOrder({
        user_id: userId,
        restaurant_id: selectedRestaurantId,
        zone_id: selectedZoneId,
        item_name: itemName.trim(),
        item_quantity: itemQuantity,
        item_price: itemPrice,
        payment_method: paymentMethod,
        estimated_delivery: estimatedDeliveryISO,
      });

      // Reset form and close modal
      handleClose();
    } catch (error) {
      // Error handling is done in store
    }
  };

  const handleClose = () => {
    if (isCreatingOrder) return; // Prevent closing while creating

    // Reset form
    setSelectedZoneId('');
    setSelectedRestaurantId('');
    setItemName('');
    setItemQuantity(1);
    setItemPrice(0);
    setPaymentMethod('');
    setEstimatedDelivery('');
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="create-order-modal-title"
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative z-10 w-full max-w-2xl mx-4 bg-white rounded-xl shadow-xl max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-zinc-200">
          <h3
            id="create-order-modal-title"
            className="text-lg font-semibold text-zinc-900"
          >
            Create Order
          </h3>
          <button
            onClick={handleClose}
            disabled={isCreatingOrder}
            className="p-1 rounded-lg hover:bg-zinc-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5 text-zinc-500" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6">
          <div className="space-y-4">
            {/* Zone */}
            <div>
              <Select
                label="Zone"
                required
                value={selectedZoneId}
                onChange={(e) => setSelectedZoneId(e.target.value)}
                options={zoneOptions}
                error={errors.zone}
                disabled={isLoadingZones || isCreatingOrder}
                helpText="Select the delivery zone"
              />
            </div>

            {/* Restaurant */}
            <div>
              <Select
                label="Restaurant"
                required
                value={selectedRestaurantId}
                onChange={(e) => setSelectedRestaurantId(e.target.value)}
                options={restaurantOptions}
                error={errors.restaurant}
                disabled={!selectedZoneId || isLoadingRestaurants || isCreatingOrder}
                helpText={selectedZoneId ? 'Select a restaurant in the chosen zone' : 'Select a zone first'}
              />
            </div>

            {/* Item Name */}
            <div>
              <Input
                label="Item Name"
                type="text"
                required
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                error={errors.itemName}
                disabled={isCreatingOrder}
                placeholder="e.g., Margherita Pizza"
              />
            </div>

            {/* Item Quantity */}
            <div>
              <Input
                label="Quantity"
                type="number"
                required
                min="1"
                value={itemQuantity}
                onChange={(e) => setItemQuantity(parseInt(e.target.value) || 1)}
                error={errors.itemQuantity}
                disabled={isCreatingOrder}
              />
            </div>

            {/* Item Price */}
            <div>
              <Input
                label="Item Price (₹)"
                type="number"
                required
                min="0"
                step="0.01"
                value={itemPrice}
                onChange={(e) => setItemPrice(parseFloat(e.target.value) || 0)}
                error={errors.itemPrice}
                disabled={isCreatingOrder}
              />
            </div>

            {/* Total Amount (Display only) */}
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">
                Total Amount
              </label>
              <div className="px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-lg text-lg font-semibold text-zinc-900">
                ₹{totalAmount.toFixed(2)}
              </div>
            </div>

            {/* Payment Method */}
            <div>
              <Select
                label="Payment Method"
                required
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                options={paymentMethodOptions}
                error={errors.paymentMethod}
                disabled={isCreatingOrder}
                helpText="Select payment method"
              />
            </div>

            {/* Estimated Delivery */}
            <div>
              <Input
                label="Estimated Delivery"
                type="datetime-local"
                required
                value={estimatedDelivery}
                onChange={(e) => setEstimatedDelivery(e.target.value)}
                error={errors.estimatedDelivery}
                disabled={isCreatingOrder}
              />
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 p-4 border-t border-zinc-200">
          <Button
            variant="secondary"
            onClick={handleClose}
            disabled={isCreatingOrder}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={isCreatingOrder}
            isLoading={isCreatingOrder}
          >
            Create Order
          </Button>
        </div>
      </div>
    </div>
  );
}
