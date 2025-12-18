import Supply from '../models/Supply.js';
import responseHandler from '../utils/responseHandler.js';

class SupplyController {
    // Create new supply order
    static async createSupply(req, res) {
        try {
            const { order_id, patient_name, clinician_name, items, total_items, order_date, insurance_type } = req.body;

            // Validation
            if (!order_id || !patient_name || !clinician_name || !items || !total_items || !order_date) {
                return responseHandler.validationError(
                    res,
                    'Order ID, patient name, clinician name, items, total items, and order date are required',
                    400
                );
            }

            const created_by = req.user?.id || null;

            const newSupply = await Supply.create({
                order_id,
                patient_name,
                clinician_name,
                items,
                total_items,
                order_date,
                insurance_type,
                created_by
            });

            return responseHandler.success(
                res,
                'Supply order created successfully',
                newSupply,
                201
            );
        } catch (error) {
            console.error('Error creating supply order:', error);

            if (error.code === '23505') {
                return responseHandler.error(
                    res,
                    'Supply order with this Order ID already exists',
                    error.message,
                    409
                );
            }

            return responseHandler.error(
                res,
                'Failed to create supply order',
                error.message,
                500
            );
        }
    }

    // Get supply order by ID
    static async getSupplyById(req, res) {
        try {
            const { id } = req.params;

            const supply = await Supply.findById(id);

            if (!supply) {
                return responseHandler.notFound(
                    res,
                    'Supply order not found',
                    404
                );
            }

            return responseHandler.success(
                res,
                'Supply order retrieved successfully',
                supply,
                200
            );
        } catch (error) {
            console.error('Error fetching supply order:', error);
            return responseHandler.error(
                res,
                'Failed to fetch supply order',
                error.message,
                500
            );
        }
    }

    // Get supply order by Order ID
    static async getSupplyByOrderId(req, res) {
        try {
            const { order_id } = req.params;

            const supply = await Supply.findByOrderId(order_id);

            if (!supply) {
                return responseHandler.notFound(
                    res,
                    'Supply order not found',
                    404
                );
            }

            return responseHandler.success(
                res,
                'Supply order retrieved successfully',
                supply,
                200
            );
        } catch (error) {
            console.error('Error fetching supply order:', error);
            return responseHandler.error(
                res,
                'Failed to fetch supply order',
                error.message,
                500
            );
        }
    }

    // Get all supply orders with filters
    static async getAllSupplies(req, res) {
        try {
            const { insurance_type, is_approve, is_decline } = req.query;

            const filters = {};

            if (insurance_type !== undefined) {
                filters.insurance_type = insurance_type;
            }

            if (is_approve !== undefined) {
                filters.is_approve = is_approve === 'true';
            }

            if (is_decline !== undefined) {
                filters.is_decline = is_decline === 'true';
            }

            const supplies = await Supply.findAll(filters);

            return responseHandler.success(
                res,
                'Supply orders retrieved successfully',
                {
                    count: supplies.length,
                    supplies
                },
                200
            );
        } catch (error) {
            console.error('Error fetching supply orders:', error);
            return responseHandler.error(
                res,
                'Failed to fetch supply orders',
                error.message,
                500
            );
        }
    }

    // Update supply order
    static async updateSupply(req, res) {
        try {
            const { id } = req.params;
            const { order_id, patient_name, clinician_name, items, total_items, order_date, insurance_type, is_approve, is_decline } = req.body;

            const updated_by = req.user?.id || null;

            // Check if supply order exists
            const existingSupply = await Supply.findById(id);
            if (!existingSupply) {
                return responseHandler.notFound(
                    res,
                    'Supply order not found',
                    404
                );
            }

            const updatedSupply = await Supply.update(id, {
                order_id,
                patient_name,
                clinician_name,
                items,
                total_items,
                order_date,
                insurance_type,
                is_approve,
                is_decline,
                updated_by
            });

            if (!updatedSupply) {
                return responseHandler.validationError(
                    res,
                    'No fields to update',
                    400
                );
            }

            return responseHandler.success(
                res,
                'Supply order updated successfully',
                updatedSupply,
                200
            );
        } catch (error) {
            console.error('Error updating supply order:', error);

            if (error.code === '23505') {
                return responseHandler.error(
                    res,
                    'Supply order with this Order ID already exists',
                    error.message,
                    409
                );
            }

            return responseHandler.error(
                res,
                'Failed to update supply order',
                error.message,
                500
            );
        }
    }

    // Approve supply order
    static async approveSupply(req, res) {
        try {
            const { id } = req.params;

            const updated_by = req.user?.id || null;

            // Check if supply order exists
            const existingSupply = await Supply.findById(id);
            if (!existingSupply) {
                return responseHandler.notFound(
                    res,
                    'Supply order not found',
                    404
                );
            }

            const updatedSupply = await Supply.update(id, {
                is_approve: true,
                is_decline: false,
                updated_by
            });

            return responseHandler.success(
                res,
                'Supply order approved successfully',
                updatedSupply,
                200
            );
        } catch (error) {
            console.error('Error approving supply order:', error);
            return responseHandler.error(
                res,
                'Failed to approve supply order',
                error.message,
                500
            );
        }
    }

    // Decline supply order
    static async declineSupply(req, res) {
        try {
            const { id } = req.params;

            const updated_by = req.user?.id || null;

            // Check if supply order exists
            const existingSupply = await Supply.findById(id);
            if (!existingSupply) {
                return responseHandler.notFound(
                    res,
                    'Supply order not found',
                    404
                );
            }

            const updatedSupply = await Supply.update(id, {
                is_approve: false,
                is_decline: true,
                updated_by
            });

            return responseHandler.success(
                res,
                'Supply order declined successfully',
                updatedSupply,
                200
            );
        } catch (error) {
            console.error('Error declining supply order:', error);
            return responseHandler.error(
                res,
                'Failed to decline supply order',
                error.message,
                500
            );
        }
    }

    // Delete supply order
    static async deleteSupply(req, res) {
        try {
            const { id } = req.params;

            const supply = await Supply.findById(id);
            if (!supply) {
                return responseHandler.notFound(
                    res,
                    'Supply order not found',
                    404
                );
            }

            const deletedSupply = await Supply.delete(id);

            return responseHandler.success(
                res,
                'Supply order deleted successfully',
                deletedSupply,
                200
            );
        } catch (error) {
            console.error('Error deleting supply order:', error);

            if (error.code === '23503') {
                return responseHandler.error(
                    res,
                    'Cannot delete supply order. It has associated records',
                    error.message,
                    409
                );
            }

            return responseHandler.error(
                res,
                'Failed to delete supply order',
                error.message,
                500
            );
        }
    }
}

export default SupplyController;
