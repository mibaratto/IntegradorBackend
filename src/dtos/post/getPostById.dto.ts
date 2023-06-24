import z from 'zod'
import { PostWithComments } from '../../models/Post'

export interface GetPostByIdInputDTO {
    token: string,
    postId: string
}

export interface GetPostByIdOutputDTO {
    postWithComments: PostWithComments
}

export const GetPostByIdSchema = z.object({
    token: z.string().min(1),
    postId: z.string().min(1)
}).transform(data => data as GetPostByIdInputDTO)
