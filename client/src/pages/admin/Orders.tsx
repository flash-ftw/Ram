import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet";
import { 
  Calendar, 
  Check, 
  FileText, 
  Info, 
  Loader2, 
  MapPin, 
  Phone, 
  UserCircle, 
  X
} from "lucide-react";
import { useTranslation } from "react-i18next";
import i18n from "i18next";

import { formatPrice, formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import AdminLayout from "@/components/admin/AdminLayout";

// Order status with corresponding colors
const statusColors = {
  PENDING: "bg-yellow-100 text-yellow-800 border-yellow-300",
  CONFIRMED: "bg-blue-100 text-blue-800 border-blue-300",
  PROCESSING: "bg-indigo-100 text-indigo-800 border-indigo-300",
  SHIPPED: "bg-purple-100 text-purple-800 border-purple-300",
  DELIVERED: "bg-green-100 text-green-800 border-green-300",
  CANCELLED: "bg-red-100 text-red-800 border-red-300",
};

type OrderStatus = keyof typeof statusColors;

interface OrderItem {
  product: {
    id: number;
    name: string;
    price: number;
    slug: string;
  };
  quantity: number;
}

interface Order {
  id: number;
  createdAt: string;
  updatedAt: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  deliveryLocation: string;
  totalAmount: number;
  items: string; // JSON string
  notes: string | null;
  status: OrderStatus;
  paymentMethod: string;
  paymentConfirmed: boolean;
}

const Orders = () => {
  const { t } = useTranslation('common');
  const isRTL = i18n.language === 'ar';
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [isUpdateStatusOpen, setIsUpdateStatusOpen] = useState(false);
  const [isMarkAsPaidOpen, setIsMarkAsPaidOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // Fetch orders
  const { data: orders, isLoading, refetch } = useQuery<Order[]>({
    queryKey: ['/api/admin/orders'],
  });

  // Parse JSON items for display
  const parseOrderItems = (order: Order) => {
    try {
      // Check if items is already an object (pre-parsed by API)
      if (typeof order.items === 'string') {
        try {
          // Try to parse as JSON
          const items = JSON.parse(order.items);
          setOrderItems(items);
        } catch (innerError) {
          // If direct parsing fails, try to see if it's a double-stringified JSON
          try {
            const items = JSON.parse(JSON.parse(order.items));
            setOrderItems(items);
          } catch (deepError) {
            console.error("Error deep-parsing order items:", deepError);
            setOrderItems([]);
          }
        }
      } else {
        // Items is already an object
        setOrderItems(order.items as unknown as OrderItem[]);
      }
    } catch (error) {
      console.error("Error parsing order items:", error);
      setOrderItems([]);
    }
  };

  // Open order details
  const showOrderDetails = (order: Order) => {
    setSelectedOrder(order);
    parseOrderItems(order);
  };

  // Close order details
  const closeOrderDetails = () => {
    setSelectedOrder(null);
    setOrderItems([]);
  };

  // Update order status
  const updateOrderStatus = async (status: OrderStatus) => {
    if (!selectedOrder) return;
    
    setIsUpdating(true);
    
    try {
      const response = await fetch(`/api/admin/orders/${selectedOrder.id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update order status');
      }
      
      const updatedOrder = await response.json();
      
      // Update local state
      setSelectedOrder(updatedOrder);
      
      // Show success message
      toast({
        title: t('admin.orders.statusUpdated'),
        description: t('admin.orders.statusUpdatedDescription', { id: selectedOrder.id, status: t(`admin.orders.statuses.${status}`) }),
      });
      
      // Close the dialog
      setIsUpdateStatusOpen(false);
      
      // Refresh the orders list
      refetch();
    } catch (error) {
      console.error('Error updating order status:', error);
      toast({
        title: t('admin.orders.error'),
        description: t('admin.orders.updateStatusError'),
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  // Mark order as paid
  const markOrderAsPaid = async () => {
    if (!selectedOrder) return;
    
    setIsUpdating(true);
    
    try {
      const response = await fetch(`/api/admin/orders/${selectedOrder.id}/payment`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to mark order as paid');
      }
      
      const updatedOrder = await response.json();
      
      // Update local state
      setSelectedOrder(updatedOrder);
      
      // Show success message
      toast({
        title: t('admin.orders.paymentConfirmed'),
        description: t('admin.orders.paymentConfirmedDescription', { id: selectedOrder.id }),
      });
      
      // Close the dialog
      setIsMarkAsPaidOpen(false);
      
      // Refresh the orders list
      refetch();
    } catch (error) {
      console.error('Error marking order as paid:', error);
      toast({
        title: t('admin.orders.error'),
        description: t('admin.orders.markAsPaidError'),
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  // Delete order
  const deleteOrder = async () => {
    if (!selectedOrder) return;
    
    if (window.confirm(t('admin.orders.deleteConfirmation', { id: selectedOrder.id }))) {
      try {
        const response = await fetch(`/api/admin/orders/${selectedOrder.id}`, {
          method: 'DELETE',
        });
        
        if (!response.ok) {
          throw new Error('Failed to delete order');
        }
        
        // Show success message
        toast({
          title: t('admin.orders.orderDeleted'),
          description: t('admin.orders.orderDeletedDescription', { id: selectedOrder.id }),
        });
        
        // Close the details and refresh the orders list
        closeOrderDetails();
        refetch();
      } catch (error) {
        console.error('Error deleting order:', error);
        toast({
          title: t('admin.orders.error'),
          description: t('admin.orders.deleteOrderError'),
          variant: "destructive",
        });
      }
    }
  };

  return (
    <AdminLayout title={t('admin.orders.title')}>
      <Helmet>
        <title>{t('admin.orders.manageOrders')} | Rammeh MotoScoot Admin</title>
      </Helmet>
      
      <div className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''} justify-between mb-6`}>
        <h1 className="text-2xl font-bold">{t('admin.orders.manageOrders')}</h1>
        <Button 
          onClick={() => refetch()}
          variant="outline"
          className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}
        >
          <FileText className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
          <span>{t('admin.orders.refreshOrders')}</span>
        </Button>
      </div>
      
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-yellow-500" />
        </div>
      ) : !orders?.length ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className={`text-gray-500 mb-4 ${isRTL ? 'rtl' : ''}`}>{t('admin.orders.noOrders')}</p>
          <Button 
            onClick={() => refetch()}
            variant="outline"
          >
            {t('admin.orders.refresh')}
          </Button>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className={isRTL ? 'text-right' : ''}>{t('admin.orders.orderId')}</TableHead>
                  <TableHead className={isRTL ? 'text-right' : ''}>{t('admin.orders.date')}</TableHead>
                  <TableHead className={isRTL ? 'text-right' : ''}>{t('admin.orders.customer')}</TableHead>
                  <TableHead className={isRTL ? 'text-right' : ''}>{t('admin.orders.amount')}</TableHead>
                  <TableHead className={isRTL ? 'text-right' : ''}>{t('admin.orders.status')}</TableHead>
                  <TableHead className={isRTL ? 'text-right' : ''}>{t('admin.orders.payment')}</TableHead>
                  <TableHead className={isRTL ? 'text-left' : 'text-right'}>{t('admin.orders.actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className={`font-medium ${isRTL ? 'text-right' : ''}`}>#{order.id}</TableCell>
                    <TableCell className={isRTL ? 'text-right' : ''}>{formatDate(new Date(order.createdAt))}</TableCell>
                    <TableCell className={isRTL ? 'text-right' : ''}>{order.customerName}</TableCell>
                    <TableCell className={isRTL ? 'text-right' : ''}>{formatPrice(order.totalAmount)}</TableCell>
                    <TableCell className={isRTL ? 'text-right' : ''}>
                      <Badge className={`${statusColors[order.status]} border`}>
                        {t(`admin.orders.statuses.${order.status}`)}
                      </Badge>
                    </TableCell>
                    <TableCell className={isRTL ? 'text-right' : ''}>
                      {order.paymentConfirmed ? (
                        <Badge className="bg-green-100 text-green-800 border border-green-300">
                          {t('admin.orders.paid')}
                        </Badge>
                      ) : (
                        <Badge className="bg-gray-100 text-gray-800 border border-gray-300">
                          {t('admin.orders.pending')}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className={isRTL ? 'text-left' : 'text-right'}>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => showOrderDetails(order)}
                        className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                      >
                        {t('admin.orders.view')}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
      
      {/* Order Details Dialog */}
      {selectedOrder && (
        <Dialog open={!!selectedOrder} onOpenChange={() => closeOrderDetails()}>
          <DialogContent className={`max-w-4xl max-h-[90vh] overflow-auto ${isRTL ? 'rtl' : ''}`}>
            <DialogHeader>
              <DialogTitle className={`flex items-center ${isRTL ? 'flex-row-reverse' : 'justify-between'}`}>
                <span>{t('admin.orders.orderDetails')} #{selectedOrder.id}</span>
                <Badge className={`${statusColors[selectedOrder.status]} border ${isRTL ? 'mr-2' : 'ml-2'}`}>
                  {t(`admin.orders.statuses.${selectedOrder.status}`)}
                </Badge>
              </DialogTitle>
              <DialogDescription className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Calendar className="h-4 w-4" />
                <span>{t('admin.orders.createdOn')} {formatDate(new Date(selectedOrder.createdAt))}</span>
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              {/* Customer Information */}
              <div className="bg-gray-50 p-4 rounded-md">
                <h3 className={`font-medium mb-3 flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <UserCircle className="h-4 w-4" />
                  <span>{t('admin.orders.customerInformation')}</span>
                </h3>
                <div className={`space-y-2 text-sm ${isRTL ? 'text-right' : ''}`}>
                  <p><span className="font-medium">{t('admin.orders.customerName')}</span> {selectedOrder.customerName}</p>
                  <p><span className="font-medium">{t('admin.orders.customerEmail')}</span> {selectedOrder.customerEmail}</p>
                  <p className={`flex items-start gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <Phone className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span>{selectedOrder.customerPhone}</span>
                  </p>
                  <p className={`flex items-start gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span>{selectedOrder.deliveryLocation}</span>
                  </p>
                </div>
              </div>
              
              {/* Order Information */}
              <div className="bg-gray-50 p-4 rounded-md">
                <h3 className={`font-medium mb-3 flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <Info className="h-4 w-4" />
                  <span>{t('admin.orders.orderInformation')}</span>
                </h3>
                <div className={`space-y-2 text-sm ${isRTL ? 'text-right' : ''}`}>
                  <p>
                    <span className="font-medium">{t('admin.orders.paymentMethod')}</span> 
                    {selectedOrder.paymentMethod === 'bank_transfer' ? t('admin.orders.bankTransfer') : selectedOrder.paymentMethod}
                  </p>
                  <p>
                    <span className="font-medium">{t('admin.orders.paymentStatus')}</span>
                    {selectedOrder.paymentConfirmed ? (
                      <span className={`${isRTL ? 'mr-2' : 'ml-2'} inline-flex items-center text-green-600`}>
                        <Check className={`h-3 w-3 ${isRTL ? 'ml-1' : 'mr-1'}`} />
                        {t('admin.orders.paid')}
                      </span>
                    ) : (
                      <span className={`${isRTL ? 'mr-2' : 'ml-2'} inline-flex items-center text-yellow-600`}>
                        <X className={`h-3 w-3 ${isRTL ? 'ml-1' : 'mr-1'}`} />
                        {t('admin.orders.pending')}
                      </span>
                    )}
                  </p>
                  <p><span className="font-medium">{t('admin.orders.totalAmount')}</span> {formatPrice(selectedOrder.totalAmount)}</p>
                  {selectedOrder.notes && (
                    <div>
                      <span className="font-medium">{t('admin.orders.notes')}</span>
                      <p className="mt-1 italic bg-white p-2 rounded border border-gray-200">{selectedOrder.notes}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Order Items */}
            <div className="mt-6">
              <h3 className={`font-medium mb-3 ${isRTL ? 'text-right' : ''}`}>{t('admin.orders.orderItems')}</h3>
              <div className="bg-gray-50 rounded-md overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className={isRTL ? 'text-right' : ''}>{t('admin.orders.product')}</TableHead>
                      <TableHead className={isRTL ? 'text-right' : 'text-center'}>{t('admin.orders.quantity')}</TableHead>
                      <TableHead className={isRTL ? 'text-left' : 'text-right'}>{t('admin.orders.price')}</TableHead>
                      <TableHead className={isRTL ? 'text-left' : 'text-right'}>{t('admin.orders.subtotal')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orderItems.map((item, idx) => (
                      <TableRow key={idx}>
                        <TableCell className={isRTL ? 'text-right' : ''}>{item.product.name}</TableCell>
                        <TableCell className={isRTL ? 'text-right' : 'text-center'}>{item.quantity}</TableCell>
                        <TableCell className={isRTL ? 'text-left' : 'text-right'}>{formatPrice(item.product.price)}</TableCell>
                        <TableCell className={isRTL ? 'text-left' : 'text-right'}>{formatPrice(item.product.price * item.quantity)}</TableCell>
                      </TableRow>
                    ))}
                    <TableRow>
                      <TableCell colSpan={3} className={isRTL ? 'text-left font-medium' : 'text-right font-medium'}>{t('admin.orders.total')}</TableCell>
                      <TableCell className={isRTL ? 'text-left font-bold' : 'text-right font-bold'}>{formatPrice(selectedOrder.totalAmount)}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </div>
            
            <Separator className="my-6" />
            
            {/* Action Buttons */}
            <DialogFooter className={`flex-col sm:flex-row gap-2 ${isRTL ? 'sm:space-x-reverse sm:flex-row-reverse' : 'sm:space-x-2'}`}>
              <Button
                onClick={() => setIsUpdateStatusOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {t('admin.orders.updateStatus')}
              </Button>
              
              {!selectedOrder.paymentConfirmed && (
                <Button
                  onClick={() => setIsMarkAsPaidOpen(true)}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  {t('admin.orders.markAsPaid')}
                </Button>
              )}
              
              <Button
                variant="destructive"
                onClick={deleteOrder}
              >
                {t('admin.orders.deleteOrder')}
              </Button>
              
              <Button
                variant="outline"
                onClick={closeOrderDetails}
              >
                {t('admin.orders.close')}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      
      {/* Update Status Dialog */}
      {selectedOrder && (
        <Dialog open={isUpdateStatusOpen} onOpenChange={setIsUpdateStatusOpen}>
          <DialogContent className={`sm:max-w-md ${isRTL ? 'rtl' : ''}`}>
            <DialogHeader>
              <DialogTitle>{t('admin.orders.updateOrderStatus')}</DialogTitle>
              <DialogDescription>
                {t('admin.orders.changeStatusFor', { id: selectedOrder.id })}
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <Select 
                defaultValue={selectedOrder.status}
                onValueChange={(value) => updateOrderStatus(value as OrderStatus)}
                disabled={isUpdating}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t('admin.orders.selectStatus')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PENDING">{t('admin.orders.statuses.PENDING')}</SelectItem>
                  <SelectItem value="CONFIRMED">{t('admin.orders.statuses.CONFIRMED')}</SelectItem>
                  <SelectItem value="PROCESSING">{t('admin.orders.statuses.PROCESSING')}</SelectItem>
                  <SelectItem value="SHIPPED">{t('admin.orders.statuses.SHIPPED')}</SelectItem>
                  <SelectItem value="DELIVERED">{t('admin.orders.statuses.DELIVERED')}</SelectItem>
                  <SelectItem value="CANCELLED">{t('admin.orders.statuses.CANCELLED')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <DialogFooter className={isRTL ? 'flex-row-reverse' : ''}>
              <Button
                variant="outline"
                onClick={() => setIsUpdateStatusOpen(false)}
              >
                {t('admin.orders.cancel')}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      
      {/* Mark as Paid Dialog */}
      {selectedOrder && (
        <Dialog open={isMarkAsPaidOpen} onOpenChange={setIsMarkAsPaidOpen}>
          <DialogContent className={`sm:max-w-md ${isRTL ? 'rtl' : ''}`}>
            <DialogHeader>
              <DialogTitle>{t('admin.orders.markOrderAsPaid')}</DialogTitle>
              <DialogDescription>
                {t('admin.orders.confirmPaymentReceived', { id: selectedOrder.id })}
              </DialogDescription>
            </DialogHeader>
            
            <div className="mt-4 mb-6">
              <p className={`text-sm ${isRTL ? 'text-right' : ''}`}>
                {t('admin.orders.paymentConfirmationInfo')}
              </p>
            </div>
            
            <DialogFooter className={isRTL ? 'flex-row-reverse' : ''}>
              <Button
                variant="outline"
                onClick={() => setIsMarkAsPaidOpen(false)}
              >
                {t('admin.orders.cancel')}
              </Button>
              
              <Button
                onClick={markOrderAsPaid}
                disabled={isUpdating}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                {isUpdating ? (
                  <>
                    <Loader2 className={`${isRTL ? 'ml-2' : 'mr-2'} h-4 w-4 animate-spin`} />
                    {t('admin.orders.processing')}
                  </>
                ) : (
                  <>
                    <Check className={`${isRTL ? 'ml-2' : 'mr-2'} h-4 w-4`} />
                    {t('admin.orders.confirmPayment')}
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </AdminLayout>
  );
};

export default Orders;