import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import {Video} from "../schema/video.schema";
import {CreateVideoDto} from "../dto/create-video.dto";

@Injectable()
export class VideoService {
    constructor(@InjectModel('Video') private videoModel: Model<Video>) { }
    async createStudent(createVideoDto: CreateVideoDto): Promise<Video> {
        const newStudent = await new this.videoModel(createVideoDto);
        return newStudent.save();
    }

    async getAllVideos(): Promise<Video[]> {
        const videoData = await this.videoModel.find();
        if (!videoData || videoData.length == 0) {
            throw new NotFoundException('Videos data not found!');
        }
        return videoData;
    }
}
