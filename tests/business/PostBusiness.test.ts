import {PostBusiness} from "../../src/business/PostBusiness";
import {IdGeneratorMock} from "../mocks/IdGeneratorMock";
import {TokenManagerMock} from "../mocks/TokenManagerMock";
import {PostDatabaseMock} from "../mocks/PostDatabaseMock";
import {Comment, Post, PostWithComments} from "../../src/models/Post";

describe("PostBusiness tests", () => {

    const postBusiness = new PostBusiness(
        new PostDatabaseMock(),
        new IdGeneratorMock(),
        new TokenManagerMock()
    )

    test("create post", async () => {
        const input = {
            content: "content",
            token: "token-mock-fulano"
        }

        let response
        expect(async () => {
            response = await postBusiness.createPost(input)
        }).not.toThrow()

        expect(response).toBeUndefined()
    })

    test("create comment", async () => {
        const input = {
            content: "content",
            token: "token-mock-fulano",
            postId: "p001"
        }

        let response
        expect(async () => {
            response = await postBusiness.createComment(input);
        }).not.toThrow()

        expect(response).toBeUndefined()
    })

    test("get posts", async () => {
        const input = {
            token: "token-mock-fulano"
        }

        const response = await postBusiness.getPosts(input);

        const expectedResponse = [{
            "content": "Content post 1",
            "createdAt": "2023-06-28T19:38:35.789Z",
            "creator": {"id":"id-mock-fulano", "name": "Fulano de Tal"},
            "dislikes": 0,
            "id": "p001",
            "likes": 1,
            "updatedAt": "2023-06-28T19:38:35.789Z"
        }, {
            "content": "Content post 2",
            "createdAt": "2023-06-28T19:38:35.789Z",
            "creator": {"id":"id-mock-fulano", "name": "Fulano de Tal"},
            "dislikes": 1,
            "id": "p002",
            "likes": 0,
            "updatedAt": "2023-06-28T19:38:35.789Z"
        }, {
            "content": "Content post 3",
            "createdAt": "2023-06-28T19:38:35.789Z",
            "creator": {"id":"id-mock-fulano", "name": "Fulano de Tal"},
            "dislikes": 0,
            "id": "p003",
            "likes": 0,
            "updatedAt": "2023-06-28T19:38:35.789Z"
        }]
        expect(response).toEqual(expectedResponse)
    })

    test("get post by id", async () => {
        const input = {
            postId: "p001",
            token: "token-mock-fulano"
        }

        const response = await postBusiness.getPostById(input);

        const expectedResponse = {
            "postWithComments": new PostWithComments(
                new Post("p001", "Content post 1", 1, 0, "2023-06-28T19:38:35.789Z", "2023-06-28T19:38:35.789Z","id-mock-fulano", "Fulano de Tal"),
                [
                    new Comment("c001", "p001", "comment", 2, 0, "2023-06-28T19:38:35.789Z", "Beltrano")
                ]
            )
        }
        expect(JSON.stringify(response)).toEqual(JSON.stringify(expectedResponse))
    })

    test("delete post - admin", async () => {
        const input = {
            idToDelete: "p001",
            token: "token-mock-astrodev"
        }

        let response
        expect(async () => {
            response = await postBusiness.deletePost(input)
        }).not.toThrow()

        expect(response).toBeUndefined()
    })

    test("delete post - creator", async () => {
        const input = {
            idToDelete: "p001",
            token: "token-mock-fulano"
        }

        let response
        expect(async () => {
            response = await postBusiness.deletePost(input)
        }).not.toThrow()

        expect(response).toBeUndefined()
    })

    test("edit post", async () => {
        const input = {
            idToEdit: "p001",
            token: "token-mock-fulano",
            content: "new content"
        }

        const response = await postBusiness.editPost(input);

        expect(response).toBeUndefined()
    })

    test("edit post fails", async () => {
        const input = {
            idToEdit: "p001",
            token: "token-mock-astrodev",
            content: "new content"
        }

        await expect(async () => {
            await postBusiness.editPost(input)
        }).rejects.toThrow()
    })

})
