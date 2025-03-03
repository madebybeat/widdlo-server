import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import {CreateCommentDto} from "../dto/create/create-comment.dto";
import {Comment} from "./comment.schema";
import {GetCommentsDto} from "../dto/get/get-comments.dto";
import {QueryDto} from "../dto/create/query.dto";
import {UpdateCommentDto} from "../dto/update/update-comment.dto";

@Injectable()
export class CommentService {
    constructor(@InjectModel('Comment') private commentModel: Model<Comment>) { }

    async createComment(createCommentDto: CreateCommentDto): Promise<Comment> {
        const comment = await new this.commentModel(createCommentDto);
        return comment.save();
    }

    async getComments(getCommentsDto: GetCommentsDto, queryDto: QueryDto): Promise<Comment[]> {
        const comments = await this.commentModel.find({target: getCommentsDto.target})
            //.populate({path: 'comments', select: ['name', 'auth'], populate: {path: 'author', select: ['username', 'avatar']}})
            .populate('comments')
            .populate('likes')
            .populate({path: 'author', select: ['avatar', 'username'], populate: {path: 'followers'}}).limit(20).skip(queryDto.page * 20);

        /*if (!comments || comments.length == 0) {
            throw new NotFoundException("No comments found.");
        }*/

        return comments;
    }
    async getCommentAmount(getCommentsDto: GetCommentsDto, queryDto: QueryDto) {
        const amount = await this.commentModel.count({target: getCommentsDto.target});
        return amount;
    }
    async updateComment(channel: string, updateCommentDto: UpdateCommentDto) {
        const comment = await this.commentModel.findOneAndUpdate({_id: updateCommentDto.id, author: channel}, updateCommentDto, {new: true});

        if (!comment) {
            throw new NotFoundException("Unknown comment or invalid authentication.");
        }

        return comment;
    }
}
