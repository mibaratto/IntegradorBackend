import { PostDatabase } from "../database/PostDatabase";
import { CreateCommentInputDTO, CreateCommentOutputDTO } from "../dtos/post/createComment.dto";
import { CreatePostInputDTO, CreatePostOutputDTO } from "../dtos/post/createPost.dto";
import { DeletePostInputDTO, DeletePostOutputDTO } from "../dtos/post/deletePost.dto";
import { EditPostInputDTO, EditPostOutputDTO } from "../dtos/post/editPost.dto";
import { GetPostByIdInputDTO, GetPostByIdOutputDTO } from "../dtos/post/getPostById.dto";
import { GetPostsInputDTO, GetPostsOutputDTO } from "../dtos/post/getPosts.dto";
import { LikeOrDislikePostInputDTO, LikeOrDislikePostOutputDTO } from "../dtos/post/likeOrDislikePost.dto";
import { ForbiddenError } from "../errors/ForbiddenError";
import { NotFoundError } from "../errors/NotFoundError";
import { UnauthorizedError } from "../errors/UnauthorizedError";
import { LikeDislikeDB, POST_LIKE, Post, Comment, PostWithComments, CommentDB } from "../models/Post";
import { USER_ROLES } from "../models/User";
import { IdGenerator } from "../services/IdGenerator";
import { TokenManager } from "../services/TokenManager";


export class PostBusiness {
    constructor(
        private postDatabase: PostDatabase,
        private idGenerator: IdGenerator,
        private tokenManager: TokenManager
    ) { }

    public createPost = async (
        input: CreatePostInputDTO
    ): Promise<CreatePostOutputDTO> => {
        const { content, token } = input

        const payload = this.tokenManager.getPayload(token)

        if (!payload) {
            throw new UnauthorizedError()
        }

        const id = this.idGenerator.generate()
        const post = new Post(
            id,
            content,
            0,
            0,
            new Date().toISOString(),
            new Date().toISOString(),
            payload.id,
            payload.name
        )
        const postDB = post.toDBModel()
        await this.postDatabase.insertPost(postDB)

        const output: CreatePostOutputDTO = undefined
        return output
    }

    public createComment = async (input:CreateCommentInputDTO): Promise<CreateCommentOutputDTO> => {

        const { postId, content, token } = input

        const payload = this.tokenManager.getPayload(token)

        if (!payload) {
            throw new UnauthorizedError()
        }

        const postDB = await this.postDatabase.findPostById(postId)

        if (!postDB) {
            throw new NotFoundError("Post with this id does not exist")
        }

        const commentId = this.idGenerator.generate()

        const commentDB = {
            id: commentId,
            post_id: postId,
            content,
            likes: 0,
            dislikes: 0,
            created_at: new Date().toISOString(),
            creator_id: payload.id
        }

        await this.postDatabase.insertComment(commentDB)

        const output: CreateCommentOutputDTO = undefined
        return output
    }


    public getPosts = async (
        input: GetPostsInputDTO
    ): Promise<GetPostsOutputDTO> => {
        const { token } = input

        const payload = this.tokenManager.getPayload(token)

        if (!payload) {
            throw new UnauthorizedError()
        }

        const postsDBwithCreatorName =
            await this.postDatabase.getPostsWithCreatorName()

        const posts = postsDBwithCreatorName
            .map((postDBwithCreatorName) => {
                const post = new Post(
                    postDBwithCreatorName.id,
                    postDBwithCreatorName.content,
                    postDBwithCreatorName.likes,
                    postDBwithCreatorName.dislikes,
                    postDBwithCreatorName.created_at,
                    postDBwithCreatorName.updated_at,
                    postDBwithCreatorName.creator_id,
                    postDBwithCreatorName.creator_name
                )

                return post.toBusinessModel()
            })

        const output: GetPostsOutputDTO = posts

        return output
    }


    public getPostById = async (
        input: GetPostByIdInputDTO
    ): Promise<GetPostByIdOutputDTO> => {
        const { token, postId } = input

        const payload = this.tokenManager.getPayload(token)

        if (!payload) {
            throw new UnauthorizedError()
        }

        const postDBwithCreatorName =
            await this.postDatabase.findPostWithCreatorNameById(postId)

        if (!postDBwithCreatorName) {
            throw new NotFoundError()
        }

        const post = new Post(
            postDBwithCreatorName.id,
            postDBwithCreatorName.content,
            postDBwithCreatorName.likes,
            postDBwithCreatorName.dislikes,
            postDBwithCreatorName.created_at,
            postDBwithCreatorName.updated_at,
            postDBwithCreatorName.creator_id,
            postDBwithCreatorName.creator_name
        )

        const commentsDBwithCreatorName =
            await this.postDatabase.findCommentsByPostId(postId)

        const comments: Comment[] = commentsDBwithCreatorName
            .map((commentDB) => {
                const comment = new Comment(
                    commentDB.id,
                    post.getId(),
                    commentDB.content,
                    commentDB.likes,
                    commentDB.dislikes,
                    commentDB.createdAt,
                    commentDB.creatorName
                )
                return comment
            })

        const postWithComments = new PostWithComments(post, comments)

        const output: GetPostByIdOutputDTO = { 
            postWithComments
        }

        return output
    }


    public editPost = async (
        input: EditPostInputDTO
    ): Promise<EditPostOutputDTO> => {
        const { content, token, idToEdit } = input

        const payload = this.tokenManager.getPayload(token)

        if (!payload) {
            throw new UnauthorizedError()
        }

        const postDB = await this.postDatabase
            .findPostById(idToEdit)

        if (!postDB) {
            throw new NotFoundError("Post with this id does not exist")
        }

        if (payload.id !== postDB.creator_id) {
            throw new ForbiddenError("Only the creator of the post can edit it")
        }

        const post = new Post(
            postDB.id,
            postDB.content,
            postDB.likes,
            postDB.dislikes,
            postDB.created_at,
            postDB.updated_at,
            postDB.creator_id,
            payload.name
        )

        post.setContent(content)

        const updatedPostDB = post.toDBModel()
        await this.postDatabase.updatePost(updatedPostDB)

        const output: EditPostOutputDTO = undefined

        return output
    }


    public deletePost = async (
        input: DeletePostInputDTO
    ): Promise<DeletePostOutputDTO> => {
        const { token, idToDelete } = input

        const payload = this.tokenManager.getPayload(token)

        if (!payload) {
            throw new UnauthorizedError()
        }

        const postDB = await this.postDatabase.findPostById(idToDelete)

        if (!postDB) {
            throw new NotFoundError("Post with this id does not exist")
        }

        if (payload.role !== USER_ROLES.ADMIN) {
            if (payload.id !== postDB.creator_id) {
                throw new ForbiddenError("Only the creator of the post can edit it")
            }
        }

        await this.postDatabase.deletePostById(idToDelete)

        const output: DeletePostOutputDTO = undefined

        return output
    }


    public likeOrDislikePost = async (
        input: LikeOrDislikePostInputDTO
    ): Promise<LikeOrDislikePostOutputDTO> => {
        const { token, like, postId } = input

        const payload = this.tokenManager.getPayload(token)

        if (!payload) {
            throw new UnauthorizedError()
        }

        const postDBWithCreatorName =
            await this.postDatabase.findPostWithCreatorNameById(postId)

        if (!postDBWithCreatorName) {
            throw new NotFoundError("Post with this id does not exist")
        }

        const post = new Post(
            postDBWithCreatorName.id,
            postDBWithCreatorName.content,
            postDBWithCreatorName.likes,
            postDBWithCreatorName.dislikes,
            postDBWithCreatorName.created_at,
            postDBWithCreatorName.updated_at,
            postDBWithCreatorName.creator_id,
            postDBWithCreatorName.creator_name
        )

        const likeSQlite = like ? 1 : 0

        const likeDislikeDB: LikeDislikeDB = {
            user_id: payload.id,
            post_id: postId,
            like: likeSQlite
        }

        const likeDislikeExists =
            await this.postDatabase.findLikeDislike(likeDislikeDB)

        if (likeDislikeExists === POST_LIKE.ALREADY_LIKED) {
            if (like) {
                await this.postDatabase.removeLikeDislike(likeDislikeDB)
                post.removeLike()
            } else {
                await this.postDatabase.updateLikeDislike(likeDislikeDB)
                post.removeLike()
                post.addDislike()
            }

        } else if (likeDislikeExists === POST_LIKE.ALREADY_DISLIKED) {
            if (like === false) {
                await this.postDatabase.removeLikeDislike(likeDislikeDB)
                post.removeDislike()
            } else {
                await this.postDatabase.updateLikeDislike(likeDislikeDB)
                post.removeDislike()
                post.addLike()
            }

        } else {
            await this.postDatabase.insertLikeDislike(likeDislikeDB)
            like ? post.addLike() : post.addDislike()
        }

        const updatedPostDB = post.toDBModel()
        await this.postDatabase.updatePost(updatedPostDB)

        const output: LikeOrDislikePostOutputDTO = undefined

        return output
    }

}
