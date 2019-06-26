process.env.NODE_ENV = "test";
const connection = require("../db/connection.js");
const request = require("supertest");
const app = require("../app.js");
const chai = require("chai");
const chaiSorted = require("chai-sorted");
const { expect } = chai;
chai.use(chaiSorted);

describe("/", () => {
  after(() => connection.destroy());
  beforeEach(() => connection.seed.run());

  it("/not-a-route", () => {
    return request(app)
      .get("/not-a-route")
      .expect(404)
      .then(res => {
        expect(res.body.msg).to.equal("Page not found");
      });
  });

  describe("/api", () => {
    describe("/topics", () => {
      it("GET status: 200, when provided a valid topics path and serves an array of all the topics objects", () => {
        return request(app)
          .get("/api/topics")
          .expect(200)
          .then(({ body }) => {
            console.log(body);
            expect(body.topics[0]).to.contain.keys("slug", "description");
          });
      });
    });
  });

  describe("/api", () => {
    describe("/users", () => {
      describe("/:username", () => {
        it("GET status: 200, when provided a valid username and serves the correct user object", () => {
          return request(app)
            .get("/api/users/butter_bridge")
            .expect(200)
            .then(({ body }) => {
              console.log(body);
              expect(body.user).to.contain.keys(
                "username",
                "avatar_url",
                "name"
              );
              expect(body.user.username).to.equal("butter_bridge");
            });
        });
        it("GET status:400 when provided with an invalid username and returns an error message", () => {
          return request(app)
            .get("/api/users/anke_teale")
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).to.equal(
                "No user found for username: anke_teale"
              );
            });
        });
      });
    });
  });
  describe("/api", () => {
    describe("/articles", () => {
      describe("/:article_id", () => {
        it("GET status: 200, when provided a valid id and serves the correct article object", () => {
          return request(app)
            .get("/api/articles/1")
            .expect(200)
            .then(({ body }) => {
              console.log(body);
              expect(body.article).to.contain.keys(
                "author",
                "title",
                "article_id",
                "body",
                "topic",
                "created_at",
                "votes",
                "comment_count"
              );
              expect(body.article.article_id).to.equal(1);
              expect(body.article.comment_count).to.equal("13");
            });
        });
        it("GET status:400 when provided with an invalid article id and returns an error message", () => {
          return request(app)
            .get("/api/articles/9999")
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).to.equal("No article found for id 9999");
            });
        });
        it("PATCH status 200: updates the number of votes than an article id has received and serves the correct article object", () => {
          return request(app)
            .patch("/api/articles/1")
            .send({ inc_votes: -100 })
            .expect(200)
            .then(({ body }) => {
              expect(body.article).to.contain.keys(
                "author",
                "title",
                "article_id",
                "body",
                "topic",
                "created_at",
                "votes"
              );
              expect(body.article.votes).to.equal(0);
            });
        });
        it("PATCH status:400 when not provided with an inc_votes object and returns an error message", () => {
          return request(app)
            .patch("/api/articles/1")
            .send({})
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).to.equal("Bad request");
            });
        });
        // it("PATCH status:400 when not provided with an inc_votes object that has invalid content and returns an error message", () => {
        //   return request(app)
        //     .patch("/api/articles/1")
        //     .send({ inc_votes: "cat" })
        //     .expect(400)
        //     .then(({ body }) => {
        //       expect(body.msg).to.equal("Bad request");
        //     });
        // });
      });
    });
  });
  it("POST request 201: returns an object with a comment where a user has posted a comment", () => {
    return request(app)
      .post("/api/articles/1/comments")
      .send({ username: "butter_bridge", body: "this is my comment" })
      .expect(201)
      .then(({ body }) => {
        expect(body.comment).to.contain.keys(
          "comment_id",
          "author",
          "article_id",
          "votes",
          "created_at",
          "body"
        );
        expect(body.comment.article_id).to.equal(1);
        expect(body.comment.author).to.equal("butter_bridge");
        expect(body.comment.body).to.equal("this is my comment");
        expect(body.comment.comment_id).to.equal(19);
      });
  });
  describe("/api", () => {
    describe("/articles", () => {
      describe("/:article_id", () => {
        describe("/comments", () => {
          it("GET status: 200, when provided a valid article id and returns an array of comments", () => {
            return request(app)
              .get("/api/articles/1/comments?sortBy=comment_id")
              .expect(200)
              .then(({ body }) => {
                expect(body).to.be.an("array");
                expect(body.length).to.equal(13);
                expect(body[0]).to.contain.keys(
                  "comment_id",
                  "article_id",
                  "author",
                  "votes",
                  "created_at",
                  "body"
                );
                expect(body).to.be.ascendingBy("comment_id");
              });
          });
        });
      });
      it("GET status:400 when provided with an invalid article id and returns an error message", () => {
        return request(app)
          .get("/api/articles/9999/comments")
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).to.equal("No comment found for article id 9999");
          });
      });
    });
  });
});
