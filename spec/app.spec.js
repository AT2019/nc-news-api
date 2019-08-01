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
    it("INVALID METHOD status: 405", () => {
      const invalidMethods = ["delete", "patch", "put"];
      const methodPromises = invalidMethods.map(method => {
        return request(app)
          [method]("/api/topics")
          .expect(405)
          .then(({ body }) => {
            expect(body.msg).to.equal("Method not allowed");
          });
      });
      return Promise.all(methodPromises);
    });
  });

  describe("/api", () => {
    describe("/topics", () => {
      it("GET status: 200, when provided a valid topics path and serves an array of all the topics objects", () => {
        return request(app)
          .get("/api/topics")
          .expect(200)
          .then(({ body }) => {
            expect(body.topics[0]).to.contain.keys("slug", "description");
          });
      });
      it("INVALID METHOD status: 405", () => {
        const invalidMethods = ["delete", "patch", "put"];
        const methodPromises = invalidMethods.map(method => {
          return request(app)
            [method]("/api/topics")
            .expect(405)
            .then(({ body }) => {
              expect(body.msg).to.equal("Method not allowed");
            });
        });
        return Promise.all(methodPromises);
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
              expect(body.user).to.contain.keys(
                "username",
                "avatar_url",
                "name"
              );
              expect(body.user.username).to.equal("butter_bridge");
            });
        });
        it("GET status:404 when provided with an invalid username and returns an error message", () => {
          return request(app)
            .get("/api/users/anke_teale")
            .expect(404)
            .then(({ body }) => {
              expect(body.msg).to.equal(
                "No user found for username: anke_teale"
              );
            });
        });
        it("INVALID METHOD status: 405", () => {
          const invalidMethods = ["delete", "patch", "put"];
          const methodPromises = invalidMethods.map(method => {
            return request(app)
              [method]("/api/users/butter_bridge")
              .expect(405)
              .then(({ body }) => {
                expect(body.msg).to.equal("Method not allowed");
              });
          });
          return Promise.all(methodPromises);
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
            .get("/api/articles/not-a-valid-route")
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).to.equal("Bad request");
            });
        });
        it("GET status: 404 if we try to get a valid, but non-existent, comment id", () => {
          return request(app)
            .get("/api/articles/9999")
            .expect(404)
            .then(({ body }) => {
              expect(body.msg).to.equal("No article found for id 9999");
            });
        });
        it("INVALID METHOD status: 405", () => {
          const invalidMethods = ["post"];
          const methodPromises = invalidMethods.map(method => {
            return request(app)
              [method]("/api/articles/1")
              .expect(405)
              .then(({ body }) => {
                expect(body.msg).to.equal("Method not allowed");
              });
          });
          return Promise.all(methodPromises);
        });
      });
      describe("/:article_id", () => {
        describe("/comments", () => {
          it("POST request 201: returns an object with a comment where a user has posted a comment", () => {
            return request(app)
              .post("/api/articles/1/comments")
              .send({
                username: "butter_bridge",
                body: "this is my comment"
              })
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
          it("POST status: 400 if we try to post something to an article which does not have a valid id", () => {
            return request(app)
              .post("/api/articles/not-a-valid-id/comments")
              .expect(400)
              .then(({ body }) => {
                expect(body.msg).to.equal("Bad request");
              });
          });
          it("POST status: 404 if we try to post something to an article which has a valid, but non-existent id", () => {
            return request(app)
              .post("/api/articles/1000/comments")
              .expect(404)
              .then(({ body }) => {
                expect(body.msg).to.equal(
                  'Key (article_id)=(1000) is not present in table "articles".'
                );
              });
          });
          it("POST status:400 when provided with an inc_votes object that has invalid content and returns an error message", () => {
            return request(app)
              .post("/api/articles/1/comments")
              .send({})
              .expect(400)
              .then(({ body }) => {
                expect(body.msg).to.equal("Bad request");
              });
          });
          it("POST status: 400 if we try to post something where the object has additional keys", () => {
            return request(app)
              .post("/api/articles/1/comments")
              .send({
                username: "butter_bridge",
                body: "this is my comment",
                cat: "cat"
              })
              .expect(400)
              .then(({ body }) => {
                expect(body.msg).to.equal("Bad request");
              });
          });
          it("POST status: 400 if we try to post something where the object has an invalid key", () => {
            return request(app)
              .post("/api/articles/1/comments")
              .send({
                badKey: "butter_bridge",
                body: "this is my comment"
              })
              .expect(400)
              .then(({ body }) => {
                expect(body.msg).to.equal("Bad request");
              });
          });
          it("POST status: 400 if we try to post something where the object key of body has an invalid value", () => {
            return request(app)
              .post("/api/articles/1/comments")
              .send({
                username: "butter_bridge",
                body: ""
              })
              .expect(400)
              .then(({ body }) => {
                expect(body.msg).to.equal("Bad request");
              });
          });
          it("INVALID METHOD status: 405", () => {
            const invalidMethods = ["delete", "patch", "put"];
            const methodPromises = invalidMethods.map(method => {
              return request(app)
                [method]("/api/articles/1/comments")
                .expect(405)
                .then(({ body }) => {
                  expect(body.msg).to.equal("Method not allowed");
                });
            });
            return Promise.all(methodPromises);
          });
        });
      });
    });

    describe("/api", () => {
      describe("/articles", () => {
        describe("/:article_id", () => {
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
          it("PATCH status:400 when provided with an invalid article id", () => {
            return request(app)
              .patch("/api/articles/not-a-valid-id")
              .expect(400)
              .then(({ body }) => {
                expect(body.msg).to.equal("Bad request");
              });
          });
          it("PATCH status:200 when provided with an empty object with no inc_votes property", () => {
            return request(app)
              .patch("/api/articles/1")
              .send({})
              .expect(200)
              .then(({ body }) => {
                expect(body.article.votes).to.equal(100);
              });
          });
          it("PATCH status: 404 if we try to patch a valid, but non-existent, article id", () => {
            return request(app)
              .patch("/api/articles/9999")
              .expect(404)
              .then(({ body }) => {
                expect(body.msg).to.equal("Article not found");
              });
          });
          it("PATCH status:400 when not provided with an inc_votes object that has invalid content and returns an error message", () => {
            return request(app)
              .patch("/api/articles/1")
              .send({ inc_votes: "cat" })
              .expect(400)
              .then(({ body }) => {
                expect(body.msg).to.equal("Bad request");
              });
          });
          it("PATCH status: 400 if we try to patch something where the object has additional keys", () => {
            return request(app)
              .patch("/api/articles/1")
              .send({ inc_votes: 2, name: "Anke" })
              .expect(400)
              .then(({ body }) => {
                expect(body.msg).to.equal("Bad request");
              });
          });
          it("PATCH status: 400 if we try to patch something where the object has an invalid key", () => {
            return request(app)
              .patch("/api/articles/1")
              .send({ bad_key: 2 })
              .expect(400)
              .then(({ body }) => {
                expect(body.msg).to.equal("Bad request");
              });
          });
          it("INVALID METHOD status: 405", () => {
            const invalidMethods = ["post"];
            const methodPromises = invalidMethods.map(method => {
              return request(app)
                [method]("/api/articles/1")
                .expect(405)
                .then(({ body }) => {
                  expect(body.msg).to.equal("Method not allowed");
                });
            });
            return Promise.all(methodPromises);
          });
        });
      });
    });
  });

  describe("/api", () => {
    describe("/articles", () => {
      describe("/:article_id", () => {
        describe("/comments", () => {
          it("GET status: 200, when provided a valid article id and returns an array of comments", () => {
            return request(app)
              .get("/api/articles/1/comments?sortBy=created_at")
              .expect(200)
              .then(({ body }) => {
                expect(body.comments[0]).to.contain.keys(
                  "comment_id",
                  "author",
                  "votes",
                  "article_id",
                  "created_at",
                  "body"
                );
                expect(body.comments.length).to.equal(13);
                expect(body.comments).to.be.descendingBy("created_at");
              });
          });
          it("GET status: 200, when provided a valid article id and returns an array of comments sorted by votes", () => {
            return request(app)
              .get("/api/articles/1/comments?sort_by=votes")
              .expect(200)
              .then(({ body }) => {
                expect(body.comments[0]).to.contain.keys(
                  "comment_id",
                  "author",
                  "votes",
                  "created_at",
                  "article_id",
                  "body"
                );
                expect(body.comments.length).to.equal(13);
                expect(body.comments).to.be.descendingBy("votes");
              });
          });
          it("GET status: 400, when provided a valid article id and returns an array of comments sorted by an invalid column name", () => {
            return request(app)
              .get("/api/articles/1/comments?sort_by=not-a-valid-column")
              .expect(400)
              .then(({ body }) => {
                expect(body.msg).to.equal("Bad request");
              });
          });
          it("GET status: 200, when provided a valid article id and returns an array of comments ordered in an ascending order", () => {
            return request(app)
              .get("/api/articles/1/comments?order=asc")
              .expect(200)
              .then(({ body }) => {
                expect(body.comments[0]).to.contain.keys(
                  "comment_id",
                  "author",
                  "votes",
                  "article_id",
                  "created_at",
                  "body"
                );
                expect(body.comments.length).to.equal(13);
                expect(body.comments).to.be.ascendingBy("created_at");
              });
          });
          it("GET status: 200, when provided a valid article id and returns an empty array if there are no corresponding comments", () => {
            return request(app)
              .get("/api/articles/2/comments")
              .expect(200)
              .then(({ body }) => {
                expect(body.comments).to.eql([]);
              });
          });
          it("GET status: 400 if we try to get a comment for an invalid article id", () => {
            return request(app)
              .get("/api/articles/not-a-valid-id/comments")
              .expect(400)
              .then(({ body }) => {
                expect(body.msg).to.equal("Bad request");
              });
          });
          it("GET status: 404 if we try to get a comment for a valid, but non-existent, article id", () => {
            return request(app)
              .get("/api/articles/9999/comments")
              .expect(404)
              .then(({ body }) => {
                expect(body.msg).to.equal("Article with id 9999 not found");
              });
          });
          it("INVALID METHOD status: 405", () => {
            const invalidMethods = ["delete", "patch", "put"];
            const methodPromises = invalidMethods.map(method => {
              return request(app)
                [method]("/api/articles/1/comments")
                .expect(405)
                .then(({ body }) => {
                  expect(body.msg).to.equal("Method not allowed");
                });
            });
            return Promise.all(methodPromises);
          });
        });
      });
    });
  });
  describe("/api", () => {
    describe("/articles", () => {
      it("GET status 200: returns an array of article objects", () => {
        return request(app)
          .get("/api/articles?sort_by=created_at")
          .expect(200)
          .then(({ body }) => {
            expect(body.articles[0]).to.contain.keys(
              "author",
              "title",
              "article_id",
              "topic",
              "created_at",
              "votes",
              "comment_count"
            );
            expect(body.articles).to.be.descendingBy("created_at");
            expect(body.total_count).to.equal(12);
          });
      });
      it("GET status 200: returns an array of article objects sorted in descending order by author", () => {
        return request(app)
          .get("/api/articles?sort_by=author")
          .expect(200)
          .then(({ body }) => {
            expect(body.articles).to.be.descendingBy("author");
          });
      });
      it("GET status 200: returns an array of article objects in ascending order by created_at", () => {
        return request(app)
          .get("/api/articles?order=asc")
          .expect(200)
          .then(({ body }) => {
            expect(body.articles).to.be.ascendingBy("created_at");
          });
      });
      it("GET status 200: returns an array of article objects filtered by author", () => {
        return request(app)
          .get("/api/articles?author=butter_bridge")
          .expect(200)
          .then(({ body }) => {
            expect(body.articles.length).to.equal(3);
          });
      });
      it("GET status 200: returns an array of article objects filtered by topic", () => {
        return request(app)
          .get("/api/articles?topic=mitch")
          .expect(200)
          .then(({ body }) => {
            expect(body.articles.length).to.equal(11);
          });
      });
      it("GET status 404: returns an error message when provided a non-existent topic", () => {
        return request(app)
          .get("/api/articles?topic=not-a-topic")
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).to.equal("Topic not found");
          });
      });
      it("GET status 404: returns an error message when provided a non-existent author", () => {
        return request(app)
          .get("/api/articles?author=not-an-author")
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).to.equal("Author not found");
          });
      });
      it("INVALID METHOD status: 405", () => {
        const invalidMethods = ["delete", "patch", "put"];
        const methodPromises = invalidMethods.map(method => {
          return request(app)
            [method]("/api/articles/1/comments")
            .expect(405)
            .then(({ body }) => {
              expect(body.msg).to.equal("Method not allowed");
            });
        });
        return Promise.all(methodPromises);
      });
    });
  });

  describe("/api", () => {
    describe("/comments", () => {
      describe("/:comment_id", () => {
        it("PATCH status 200: updates the number of votes than comments has received and returns the correct comment object", () => {
          return request(app)
            .patch("/api/comments/1")
            .send({ inc_votes: 2 })
            .expect(200)
            .then(({ body }) => {
              expect(body.comment).to.contain.keys(
                "comment_id",
                "votes",
                "created_at",
                "author",
                "body"
              );
              expect(body.comment.votes).to.equal(18);
            });
        });
        it("PATCH status: 400 if we try to patch something which does not have a valid comment id", () => {
          return request(app)
            .patch("/api/comments/not-a-valid-comment-id")
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).to.equal("Bad request");
            });
        });
        it("PATCH status: 404 if we try to patch something which has a valid, but non-existent, comment id", () => {
          return request(app)
            .patch("/api/comments/1000")
            .expect(404)
            .then(({ body }) => {
              expect(body.msg).to.equal("Comment with id 1000 not found");
            });
        });
        it("PATCH status: 400 if we try to patch something where the object has additional keys", () => {
          return request(app)
            .patch("/api/comments/1")
            .send({ inc_votes: 2, name: "Anke" })
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).to.equal("Bad request");
            });
        });
        it("PATCH status: 400 if we try to patch something where the object has an invalid key", () => {
          return request(app)
            .patch("/api/comments/1")
            .send({ bad_key: 2 })
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).to.equal("Bad request");
            });
        });
        it("PATCH status: 400 if we try to patch something where the object has an invalid value", () => {
          return request(app)
            .patch("/api/comments/1")
            .send({ inc_votes: "cat" })
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).to.equal("Bad request");
            });
        });
        it("PATCH status: 200 if we try to patch something where the object has no inc_votes property", () => {
          return request(app)
            .patch("/api/comments/1")
            .send({})
            .expect(200)
            .then(({ body }) => {
              expect(body.comment).to.contain.keys(
                "comment_id",
                "votes",
                "created_at",
                "author",
                "body"
              );
              expect(body.comment.votes).to.equal(16);
            });
        });
        it("PATCH status: 404 if we try to patch a valid, but non-existent, comment id", () => {
          return request(app)
            .delete("/api/comments/9999")
            .expect(404)
            .then(({ body }) => {
              expect(body.msg).to.equal("Comment with id 9999 not found");
            });
        });
        it("INVALID METHOD status: 405", () => {
          const invalidMethods = ["post"];
          const methodPromises = invalidMethods.map(method => {
            return request(app)
              [method]("/api/comments/1")
              .expect(405)
              .then(({ body }) => {
                expect(body.msg).to.equal("Method not allowed");
              });
          });
          return Promise.all(methodPromises);
        });
      });
    });
  });

  describe("/comments", () => {
    describe("/:comment_id", () => {
      it("DELETE status: 204 when provided a valid comment_id", () => {
        return request(app)
          .delete("/api/comments/1")
          .expect(204);
      });
      it("DELETE status: 400 if we try to delete something which does not have a valid id", () => {
        return request(app)
          .delete("/api/comments/not-a-valid-id")
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).to.equal("Bad request");
          });
      });
      it("DELETE status: 404 if we try to delete a valid, but non-existent, comment id", () => {
        return request(app)
          .delete("/api/comments/9999")
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).to.equal("Comment with id 9999 not found");
          });
      });
      it("INVALID METHOD status: 405", () => {
        const invalidMethods = ["post"];
        const methodPromises = invalidMethods.map(method => {
          return request(app)
            [method]("/api/comments/1")
            .expect(405)
            .then(({ body }) => {
              expect(body.msg).to.equal("Method not allowed");
            });
        });
        return Promise.all(methodPromises);
      });
    });
  });
  describe("/articles", () => {
    describe("/:article_id", () => {
      it("DELETE status: 204 when provided a valid article_id", () => {
        return request(app)
          .delete("/api/articles/2")
          .expect(204);
      });
      it("DELETE status: 400 if we try to delete something which does not have a valid id", () => {
        return request(app)
          .delete("/api/articles/not-a-valid-id")
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).to.equal("Bad request");
          });
      });
      it("DELETE status: 404 if we try to delete a valid, but non-existent, article id", () => {
        return request(app)
          .delete("/api/articles/9999")
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).to.equal("Article with id 9999 not found");
          });
      });
      it("INVALID METHOD status: 405", () => {
        const invalidMethods = ["post"];
        const methodPromises = invalidMethods.map(method => {
          return request(app)
            [method]("/api/articles/1")
            .expect(405)
            .then(({ body }) => {
              expect(body.msg).to.equal("Method not allowed");
            });
        });
      });
    });
  });
  describe("/users", () => {
    it("POST request 201: returns a new user", () => {
      return request(app)
        .post("/api/users")
        .send({
          username: "anke_teale",
          name: "anke",
          avatar_url: "https://github.com/AT2019"
        })
        .expect(201)
        .then(({ body }) => {
          expect(body.user).to.contain.keys("username", "name", "avatar_url");
          expect(body.user.username).to.equal("anke_teale");
          expect(body.user.name).to.equal("anke");
          expect(body.user.avatar_url).to.equal("https://github.com/AT2019");
        });
    });
    it("INVALID METHOD status: 405", () => {
      const invalidMethods = ["delete", "patch", "put"];
      const methodPromises = invalidMethods.map(method => {
        return request(app)
          [method]("/api/users")
          .expect(405)
          .then(({ body }) => {
            expect(body.msg).to.equal("Method not allowed");
          });
      });
      return Promise.all(methodPromises);
    });
  });
  describe("/users", () => {
    it("GET status: 200, when provided a valid users path and serves an array of all the users objects", () => {
      return request(app)
        .get("/api/users")
        .expect(200)
        .then(({ body }) => {
          expect(body.users[0]).to.contain.keys(
            "username",
            "name",
            "avatar_url"
          );
        });
    });
    it("INVALID METHOD status: 405", () => {
      const invalidMethods = ["delete", "patch", "put"];
      const methodPromises = invalidMethods.map(method => {
        return request(app)
          [method]("/api/users")
          .expect(405)
          .then(({ body }) => {
            expect(body.msg).to.equal("Method not allowed");
          });
      });
      return Promise.all(methodPromises);
    });
  });
  describe("/topics", () => {
    it("POST request 201: returns a new topic", () => {
      return request(app)
        .post("/api/topics")
        .send({
          slug: "racing",
          description:
            "Racing is life. Anything before or after is just waiting"
        })
        .expect(201)
        .then(({ body }) => {
          expect(body.topic).to.contain.keys("slug", "description");
          expect(body.topic.slug).to.equal("racing");
          expect(body.topic.description).to.equal(
            "Racing is life. Anything before or after is just waiting"
          );
        });
    });
    it("INVALID METHOD status: 405", () => {
      const invalidMethods = ["delete", "patch", "put"];
      const methodPromises = invalidMethods.map(method => {
        return request(app)
          [method]("/api/topics")
          .expect(405)
          .then(({ body }) => {
            expect(body.msg).to.equal("Method not allowed");
          });
      });
      return Promise.all(methodPromises);
    });
  });
  describe("/articles", () => {
    it("POST request 201: returns a new articles", () => {
      return request(app)
        .post("/api/articles")
        .send({
          title: "They're not exactly cats, are they?",
          topic: "mitch",
          author: "rogersop",
          body: "Well? Think about it."
        })
        .expect(201)
        .then(({ body }) => {
          expect(body.article).to.contain.keys(
            "article_id",
            "author",
            "title",
            "topic",
            "created_at",
            "votes"
          );
          expect(body.article.author).to.equal("rogersop");
          expect(body.article.title).to.equal(
            "They're not exactly cats, are they?"
          );
        });
    });
    it("INVALID METHOD status: 405", () => {
      const invalidMethods = ["delete", "patch", "put"];
      const methodPromises = invalidMethods.map(method => {
        return request(app)
          [method]("/api/articles")
          .expect(405)
          .then(({ body }) => {
            expect(body.msg).to.equal("Method not allowed");
          });
      });
      return Promise.all(methodPromises);
    });
  });
});
