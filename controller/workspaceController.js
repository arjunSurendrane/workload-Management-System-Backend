import Workspace from "../models/workSpaceModal.js";

// create token and send response
const successresponse = async (res, statusCode, data) => {
    res.status(statusCode).json({
        status: 'success',
        data
    })
}

// send error response
const errorResponse = async (res, statusCode, error) => {
    res.status(statusCode).json({
        status: 'fail',
        error
    })
}

// Create WorkSpace 
export const createWorkspace = async (req, res) => {
    try {
        const { name } = req.body
        const workspace = new Workspace({
            Name: name,
            Lead: req.user._id
        })
        await workspace.save()
        successresponse(res, 200, workspace);
    } catch (error) {
        errorResponse(res, 404, error)
    }
}

// Get WorkSpaceData
export const getWorkspace = async (req, res) => {
    try {
        const workspace = await Workspace.find().populate('Lead').populate('members.memberId')
        successresponse(res, 200, workspace)
    } catch (error) {
        errorResponse(res, 404, error)
    }
}

// Add members into Workspace
export const addMembers = async (req, res) => {
    try {
        console.log(req.body)
        const { members } = req.body
        const newWorkSpace = await Workspace.findOneAndUpdate({ _id: req.params.id }, {
            $push: {
                members: { memberId: members }
            }
        }, { new: true, upsert: true })
        console.log(newWorkSpace)
        successresponse(res, 200, newWorkSpace)
    } catch (error) {
        errorResponse(res, 404, `error : ${error}`)
    }
}