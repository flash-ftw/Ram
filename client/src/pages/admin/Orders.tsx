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
      const items = JSON.parse(order.items);
      setOrderItems(items);
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
        title: "Status Updated",
        description: `Order #${selectedOrder.id} status changed to ${status}`,
      });
      
      // Close the dialog
      setIsUpdateStatusOpen(false);
      
      // Refresh the orders list
      refetch();
    } catch (error) {
      console.error('Error updating order status:', error);
      toast({
        title: "Error",
        description: "Failed to update order status. Please try again.",
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
        title: "Payment Confirmed",
        description: `Order #${selectedOrder.id} marked as paid`,
      });
      
      // Close the dialog
      setIsMarkAsPaidOpen(false);
      
      // Refresh the orders list
      refetch();
    } catch (error) {
      console.error('Error marking order as paid:', error);
      toast({
        title: "Error",
        description: "Failed to mark order as paid. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  // Delete order
  const deleteOrder = async () => {
    if (!selectedOrder) return;
    
    if (window.confirm(`Are you sure you want to delete order #${selectedOrder.id}?`)) {
      try {
        const response = await fetch(`/api/admin/orders/${selectedOrder.id}`, {
          method: 'DELETE',
        });
        
        if (!response.ok) {
          throw new Error('Failed to delete order');
        }
        
        // Show success message
        toast({
          title: "Order Deleted",
          description: `Order #${selectedOrder.id} has been deleted`,
        });
        
        // Close the details and refresh the orders list
        closeOrderDetails();
        refetch();
      } catch (error) {
        console.error('Error deleting order:', error);
        toast({
          title: "Error",
          description: "Failed to delete order. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <AdminLayout>
      <Helmet>
        <title>Manage Orders | Rammeh MotoScoot Admin</title>
      </Helmet>
      
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Manage Orders</h1>
        <Button 
          onClick={() => refetch()}
          variant="outline"
          className="flex items-center gap-2"
        >
          <FileText className="h-4 w-4" />
          <span>Refresh Orders</span>
        </Button>
      </div>
      
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-yellow-500" />
        </div>
      ) : !orders?.length ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-gray-500 mb-4">No orders found</p>
          <Button 
            onClick={() => refetch()}
            variant="outline"
          >
            Refresh
          </Button>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">#{order.id}</TableCell>
                    <TableCell>{formatDate(new Date(order.createdAt))}</TableCell>
                    <TableCell>{order.customerName}</TableCell>
                    <TableCell>{formatPrice(order.totalAmount)}</TableCell>
                    <TableCell>
                      <Badge className={`${statusColors[order.status]} border`}>
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {order.paymentConfirmed ? (
                        <Badge className="bg-green-100 text-green-800 border border-green-300">
                          Paid
                        </Badge>
                      ) : (
                        <Badge className="bg-gray-100 text-gray-800 border border-gray-300">
                          Pending
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => showOrderDetails(order)}
                        className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                      >
                        View
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
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between">
                <span>Order #{selectedOrder.id}</span>
                <Badge className={`${statusColors[selectedOrder.status]} border ml-2`}>
                  {selectedOrder.status}
                </Badge>
              </DialogTitle>
              <DialogDescription className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>Created on {formatDate(new Date(selectedOrder.createdAt))}</span>
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              {/* Customer Information */}
              <div className="bg-gray-50 p-4 rounded-md">
                <h3 className="font-medium mb-3 flex items-center gap-2">
                  <UserCircle className="h-4 w-4" />
                  <span>Customer Information</span>
                </h3>
                <div className="space-y-2 text-sm">
                  <p><span className="font-medium">Name:</span> {selectedOrder.customerName}</p>
                  <p><span className="font-medium">Email:</span> {selectedOrder.customerEmail}</p>
                  <p className="flex items-start gap-1">
                    <Phone className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span>{selectedOrder.customerPhone}</span>
                  </p>
                  <p className="flex items-start gap-1">
                    <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span>{selectedOrder.deliveryLocation}</span>
                  </p>
                </div>
              </div>
              
              {/* Order Information */}
              <div className="bg-gray-50 p-4 rounded-md">
                <h3 className="font-medium mb-3 flex items-center gap-2">
                  <Info className="h-4 w-4" />
                  <span>Order Information</span>
                </h3>
                <div className="space-y-2 text-sm">
                  <p>
                    <span className="font-medium">Payment Method:</span> 
                    {selectedOrder.paymentMethod === 'bank_transfer' ? 'Bank Transfer' : selectedOrder.paymentMethod}
                  </p>
                  <p>
                    <span className="font-medium">Payment Status:</span>
                    {selectedOrder.paymentConfirmed ? (
                      <span className="ml-2 inline-flex items-center text-green-600">
                        <Check className="h-3 w-3 mr-1" />
                        Paid
                      </span>
                    ) : (
                      <span className="ml-2 inline-flex items-center text-yellow-600">
                        <X className="h-3 w-3 mr-1" />
                        Pending
                      </span>
                    )}
                  </p>
                  <p><span className="font-medium">Total Amount:</span> {formatPrice(selectedOrder.totalAmount)}</p>
                  {selectedOrder.notes && (
                    <div>
                      <span className="font-medium">Notes:</span>
                      <p className="mt-1 italic bg-white p-2 rounded border border-gray-200">{selectedOrder.notes}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Order Items */}
            <div className="mt-6">
              <h3 className="font-medium mb-3">Order Items</h3>
              <div className="bg-gray-50 rounded-md overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead className="text-center">Quantity</TableHead>
                      <TableHead className="text-right">Price</TableHead>
                      <TableHead className="text-right">Subtotal</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orderItems.map((item, idx) => (
                      <TableRow key={idx}>
                        <TableCell>{item.product.name}</TableCell>
                        <TableCell className="text-center">{item.quantity}</TableCell>
                        <TableCell className="text-right">{formatPrice(item.product.price)}</TableCell>
                        <TableCell className="text-right">{formatPrice(item.product.price * item.quantity)}</TableCell>
                      </TableRow>
                    ))}
                    <TableRow>
                      <TableCell colSpan={3} className="text-right font-medium">Total</TableCell>
                      <TableCell className="text-right font-bold">{formatPrice(selectedOrder.totalAmount)}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </div>
            
            <Separator className="my-6" />
            
            {/* Action Buttons */}
            <DialogFooter className="flex-col sm:flex-row gap-2 sm:space-x-2">
              <Button
                onClick={() => setIsUpdateStatusOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Update Status
              </Button>
              
              {!selectedOrder.paymentConfirmed && (
                <Button
                  onClick={() => setIsMarkAsPaidOpen(true)}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  Mark as Paid
                </Button>
              )}
              
              <Button
                variant="destructive"
                onClick={deleteOrder}
              >
                Delete Order
              </Button>
              
              <Button
                variant="outline"
                onClick={closeOrderDetails}
              >
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      
      {/* Update Status Dialog */}
      {selectedOrder && (
        <Dialog open={isUpdateStatusOpen} onOpenChange={setIsUpdateStatusOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Update Order Status</DialogTitle>
              <DialogDescription>
                Change the status for order #{selectedOrder.id}
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <Select 
                defaultValue={selectedOrder.status}
                onValueChange={(value) => updateOrderStatus(value as OrderStatus)}
                disabled={isUpdating}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                  <SelectItem value="PROCESSING">Processing</SelectItem>
                  <SelectItem value="SHIPPED">Shipped</SelectItem>
                  <SelectItem value="DELIVERED">Delivered</SelectItem>
                  <SelectItem value="CANCELLED">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsUpdateStatusOpen(false)}
              >
                Cancel
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      
      {/* Mark as Paid Dialog */}
      {selectedOrder && (
        <Dialog open={isMarkAsPaidOpen} onOpenChange={setIsMarkAsPaidOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Mark Order as Paid</DialogTitle>
              <DialogDescription>
                Confirm that payment has been received for order #{selectedOrder.id}
              </DialogDescription>
            </DialogHeader>
            
            <div className="mt-4 mb-6">
              <p className="text-sm">
                This will mark the order as paid and update its status to "Confirmed".
                This action cannot be undone.
              </p>
            </div>
            
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsMarkAsPaidOpen(false)}
              >
                Cancel
              </Button>
              
              <Button
                onClick={markOrderAsPaid}
                disabled={isUpdating}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                {isUpdating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Confirm Payment
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