process.env.NODE_ENV = "test";
const connection = require("../db/connection.js");
const request = require("supertest");
const app = require("../app.js");
const chai = require("chai");
const { expect } = chai;

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
      });
    });
  });
});
