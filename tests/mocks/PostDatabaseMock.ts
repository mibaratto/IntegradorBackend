import {
    CommentDB,
    CommentDBWithCreatorName,
    LikeDislikeDB,
    POST_LIKE,
    PostDB,
    PostDBWithCreatorName
} from "../../src/models/Post";
import {BaseDatabase} from "../../src/database/BaseDatabase";

const postsMock: PostDB[] = [
    {
        id: "p001",
        creator_id: "id-mock-fulano",
        content: "Content post 1",
        likes: 1,
        dislikes: 0,
        created_at: "2023-06-28T19:38:35.789Z",
        updated_at: "2023-06-28T19:38:35.789Z"
    },
    {
        id: "p002",
        creator_id: "id-mock-fulano",
        content: "Content post 2",
        likes: 0,
        dislikes: 1,
        created_at: "2023-06-28T19:38:35.789Z",
        updated_at: "2023-06-28T19:38:35.789Z"
    },
    {
        id: "p003",
        creator_id: "id-mock-fulano",
        content: "Content post 3",
        likes: 0,
        dislikes: 0,
        created_at: "2023-06-28T19:38:35.789Z",
        updated_at: "2023-06-28T19:38:35.789Z"
    }
]

// export const likesOrDislikesPostMock: LikeDislikePostDB[] = [
//     {
//         user_id: 'id-mock-admin',
//         post_id: 'p001',
//         like: 1,
//     },
//     {
//         user_id: 'id-mock-normal',
//         post_id: 'p002',
//         like: 0,
//     }
// ]

export class PostDatabaseMock extends BaseDatabase {

    public insertPost = async (
        postDB: PostDB
    ): Promise<void> => {

    }

    public insertComment = async (
        commentDB: CommentDB
    ): Promise<void> => {
        return undefined
    }

    public getPostsWithCreatorName = async (): Promise<PostDBWithCreatorName[]> => {
        return postsMock.map(post => {
            return {
                ...post,
                creator_name: 'Fulano de Tal'
            }
        })
    }


    public findPostById = async (
        id: string
    ): Promise<PostDB | undefined> => {
        return postsMock[0]
    }


    public updatePost = async (
        postDB: PostDB
    ): Promise<void> => {
        return undefined
    }


    public deletePostById = async (
        id: string
    ): Promise<void> => {
        return undefined
    }


    public findPostWithCreatorNameById = async (id: string): Promise<PostDBWithCreatorName | undefined> => {
        return {
            id: id,
            creator_id: "id-mock-fulano",
            content: "Content post 1",
            likes: 1,
            dislikes: 0,
            created_at: "2023-06-28T19:38:35.789Z",
            updated_at: "2023-06-28T19:38:35.789Z",
            creator_name: 'Fulano de Tal'
        }
    }

    public findCommentsByPostId = async (postId: string): Promise<CommentDBWithCreatorName[]> => {
        return [{
            id: "c001",
            postId: postId,
            content: "comment",
            likes: 2,
            dislikes: 0,
            createdAt: "2023-06-28T19:38:35.789Z",
            creatorName: 'Beltrano'
        }]
    }


    public findLikeDislike = async (
        likeDislikeDB: LikeDislikeDB
    ): Promise<POST_LIKE | undefined> => {

        return undefined
    }


    public removeLikeDislike = async (
        likeDislikeDB: LikeDislikeDB
    ): Promise<void> => {

    }


    public updateLikeDislike = async (
        likeDislikeDB: LikeDislikeDB
    ): Promise<void> => {

    }


    public insertLikeDislike = async (
        likeDislikeDB: LikeDislikeDB
    ): Promise<void> => {

    }
}
