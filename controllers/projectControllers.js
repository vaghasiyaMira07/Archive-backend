// Required Models
const Project = require("../models/project");

module.exports = {
    getProjects: async(req, res, next) => {
        try {
            const projects = await Project.find({}).populate('assign');
            return res.status(200).json({
                success: true,
                data: projects
            });
        } catch (e) {
            return res.status(400).json({ error: e.message });
        }
    },

    getassignProjects: async(req, res, next) => {
        try {
            const { userId } = req.user;
            const projects = await Project.find({ assign: { $in: userId } });
            return res.status(200).json({
                success: true,
                data: projects
            });
        } catch (e) {
            return res.status(400).json({ error: e.message });
        }

    },

    addProject: async(req, res, next) => {
        try {
            const { userRole } = req.user;
            if (userRole == "admin") {
                const { name, description } = req.body;
                if (!name || !description) {
                    return res.status(400).json({
                        success: false,
                        error: "Please provide all required fields"
                    });
                }
                const project = await Project.create({ name, description });
                return res.status(200).json({
                    success: true,
                    data: project
                });
            } else {
                return res.status(401).json({
                    success: false,
                    error: "You are not authorized to perform this action"
                });
            }
        } catch (e) {
            return res.status(400).json({ error: e.message });
        }
    },

    editProject: async(req, res, next) => {
        try {
            const { userRole } = req.user;
            if (userRole == "admin") {
                const { name, description, isActive } = req.body;
                if (!name || !description) {
                    return res.status(400).json({
                        success: false,
                        error: "Please provide all required fields"
                    });
                }
                const project = await Project.findByIdAndUpdate(req.params.id, { name, description, isActive }, { new: true });
                return res.status(200).json({
                    success: true,
                    data: project
                });
            } else {
                return res.status(401).json({
                    success: false,
                    error: "You are not authorized to perform this action"
                });
            }
        } catch (e) {
            return res.status(400).json({ error: e.message });
        }
    },

    assignproject: async(req, res, next) => {
        try {
            const { userRole } = req.user;
            if (userRole == "admin") {
                const { assign } = req.body;
                if (!assign) {
                    return res.status(400).json({
                        success: false,
                        error: "Please provide all required fields"
                    });
                }
                const project = await Project.findByIdAndUpdate(req.params.id, { assign }, { new: true });
                return res.status(200).json({
                    success: true,
                    data: project
                });
            } else {
                return res.status(401).json({
                    success: false,
                    error: "You are not authorized to perform this action"
                });
            }
        } catch (e) {
            return res.status(400).json({ error: e.message });
        }
    },

    deleteProject: async(req, res, next) => {
        try {
            const { userRole } = req.user;
            if (userRole == "admin") {
                const project = await Project.findByIdAndDelete(req.params.id);
                return res.status(200).json({
                    success: true,
                    data: project
                });
            } else {
                return res.status(401).json({
                    success: false,
                    error: "You are not authorized to perform this action"
                });
            }
        } catch (e) {
            return res.status(400).json({ error: e.message });
        }
    }
};