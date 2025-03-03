import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import {Channel} from "./channel.schema";
import {CreateChannelDto} from "../dto/create/create-channel.dto";
import {ChannelInfoDto} from "../dto/create/channel-info.dto";
import {UpdateChannelDto} from "../dto/update/update-channel.dto";

@Injectable()
export class ChannelService {
    constructor(@InjectModel('Channel') private channelModel: Model<Channel>) { }
    async createChannel(createChannelDto: CreateChannelDto): Promise<Channel> {
        const channel = await new this.channelModel(createChannelDto);
        return channel.save();
    }

    async getChannelInfo(channelInfoDto: ChannelInfoDto): Promise<Channel> {
        const channel = await this.channelModel.findById(channelInfoDto.channel).select(["user", "username", "avatar", "description", "views", "date", "verified"])
            .populate("followers").populate("stream", ["id"]).populate("chats", ["name"]).populate("subscriptions", ["id"])
            .populate({path: 'badges', populate: {path: "badge"}});

        if (!channel) {
            throw new NotFoundException('Channel could not found!');
        }

        await channel.update({views: channel.views + 1});

        return channel;
    }

    async getChannel(id: string): Promise<Channel> {
        const channel = await this.channelModel.findById(id).populate("followers").populate("stream", ["id"]).populate("chats", ["name"]);

        if (!channel) {
            throw new NotFoundException('Channel could not found!');
        }

        return channel;
    }

    async checkExists(channel: string) {
        return this.channelModel.exists({_id: channel});
    }
    async getUserChannel(user: string) {
        return this.channelModel.findOne({user: user});
    }
    async updateChannel(id: string, updateChannelDto: UpdateChannelDto) {
        // @ts-ignore
        const channel = await this.channelModel.findOneAndUpdate(id, updateChannelDto, {new: true});

        if (!channel) {
            throw new NotFoundException("Unknown channel or invalid authentication.");
        }

        return channel;
    }
}