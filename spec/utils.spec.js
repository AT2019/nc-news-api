const { expect } = require("chai");
const { formatDate, makeRefObj, formatComments } = require("../db/utils/utils");

describe("formatDate", () => {
  it("returns the value of the created_at field in a PSQL rather than UNIX timestamp format when passed an array containing one object with a value of 0", () => {
    const input = [{ created_at: 0 }];
    const actual = formatDate(input);
    const expected = [{ created_at: new Date(0) }];
    expect(actual).to.eql(expected);
  });
  it("returns the value of the created_at field in a PSQL rather than UNIX timestamp format when passed an array containing one article", () => {
    const input = [
      {
        created_at: 1471522072389
      }
    ];
    const actual = formatDate(input);
    const expected = [{ created_at: new Date(1471522072389) }];
    // console.log(input[0].created_at);
    expect(actual).to.eql(expected);
  });
  it("returns the value of the created_at field in a PSQL rather than UNIX timestamp format when passed an array containing more than one article", () => {
    const input = [
      {
        title: "Running a Node App",
        topic: "coding",
        author: "jessjelly",
        body:
          "This is part two of a series on how to get up and running with Systemd and Node.js. This part dives deeper into how to successfully run your app with systemd long-term, and how to set it up in a production environment.",
        created_at: 1471522072389
      },
      {
        title:
          "The Rise Of Thinking Machines: How IBM's Watson Takes On The World",
        topic: "coding",
        author: "jessjelly",
        body:
          "Many people know Watson as the IBM-developed cognitive super computer that won the Jeopardy! gameshow in 2011. In truth, Watson is not actually a computer but a set of algorithms and APIs, and since winning TV fame (and a $1 million prize) IBM has put it to use tackling tough problems in every industry from healthcare to finance. Most recently, IBM has announced several new partnerships which aim to take things even further, and put its cognitive capabilities to use solving a whole new range of problems around the world.",
        created_at: 1500584273256
      }
    ];
    const actual = formatDate(input);
    const expected = [
      {
        title: "Running a Node App",
        topic: "coding",
        author: "jessjelly",
        body:
          "This is part two of a series on how to get up and running with Systemd and Node.js. This part dives deeper into how to successfully run your app with systemd long-term, and how to set it up in a production environment.",
        created_at: new Date(1471522072389)
      },
      {
        title:
          "The Rise Of Thinking Machines: How IBM's Watson Takes On The World",
        topic: "coding",
        author: "jessjelly",
        body:
          "Many people know Watson as the IBM-developed cognitive super computer that won the Jeopardy! gameshow in 2011. In truth, Watson is not actually a computer but a set of algorithms and APIs, and since winning TV fame (and a $1 million prize) IBM has put it to use tackling tough problems in every industry from healthcare to finance. Most recently, IBM has announced several new partnerships which aim to take things even further, and put its cognitive capabilities to use solving a whole new range of problems around the world.",
        created_at: new Date(1500584273256)
      }
    ];

    expect(actual).to.eql(expected);
  });
});

describe("makeRefObj", () => {
  it("returns an empty object when passed an empty array", () => {
    const input = [];
    const actual = makeRefObj(input);
    const expected = {};
    expect(actual).to.eql(expected);
  });
  it("returns an object with one article_id when passed an array containing one article object", () => {
    const input = [{ article_id: 36, title: "The vegan carnivore?" }];
    const actual = makeRefObj(input);
    const expected = { "The vegan carnivore?": 36 };
    expect(actual).to.eql(expected);
  });
  it("returns objects with article_ids when passed an array containing multiple article objects", () => {
    const input = [
      { article_id: 36, title: "The vegan carnivore?" },
      { article_id: 35, title: "Stone Soup" }
    ];
    const actual = makeRefObj(input);
    const expected = { "The vegan carnivore?": 36, "Stone Soup": 35 };
    expect(actual).to.eql(expected);
  });
});

describe("formatComments", () => {
  it("produces an empty array when passed an empty array of articles and a lookup reference object", () => {
    const articles = [];
    const refObj = {};
    const actual = formatComments(articles, refObj);
    const expected = [];
    expect(actual).to.eql(expected);
  });
  it("returns an array with an object which replaces the title property on a single comment with the correct article id, gives the correct date and renames the created_by key to author when passed an array with a single object", () => {
    const input = [
      {
        body:
          "Itaque quisquam est similique et est perspiciatis reprehenderit voluptatem autem. Voluptatem accusantium eius error adipisci quibusdam doloribus.",
        belongs_to:
          "The People Tracking Every Touch, Pass And Tackle in the World Cup",
        created_by: "tickle122",
        votes: -1,
        created_at: 1468087638932
      }
    ];
    const articleRef = {
      "The People Tracking Every Touch, Pass And Tackle in the World Cup": 18
    };
    const actual = formatComments(input, articleRef);
    const expected = [
      {
        body:
          "Itaque quisquam est similique et est perspiciatis reprehenderit voluptatem autem. Voluptatem accusantium eius error adipisci quibusdam doloribus.",
        article_id: 18,
        author: "tickle122",
        votes: -1,
        created_at: new Date(1468087638932)
      }
    ];
    expect(actual).to.eql(expected);
  });
  it("returns an array of objects which replace the title property on a comment with the correct article id, gives the correct date and renames the created_by key to author when passed an array with multiple objects", () => {
    const input = [
      {
        body:
          "Itaque quisquam est similique et est perspiciatis reprehenderit voluptatem autem. Voluptatem accusantium eius error adipisci quibusdam doloribus.",
        belongs_to:
          "The People Tracking Every Touch, Pass And Tackle in the World Cup",
        created_by: "tickle122",
        votes: -1,
        created_at: 1468087638932
      },
      {
        body: "Nobis consequatur animi. Ullam nobis quaerat voluptates veniam.",
        belongs_to: "Making sense of Redux",
        created_by: "grumpy19",
        votes: 7,
        created_at: 1478813209256
      }
    ];
    const articleRef = {
      "The People Tracking Every Touch, Pass And Tackle in the World Cup": 18,
      "Making sense of Redux": 20
    };
    const actual = formatComments(input, articleRef);
    const expected = [
      {
        body:
          "Itaque quisquam est similique et est perspiciatis reprehenderit voluptatem autem. Voluptatem accusantium eius error adipisci quibusdam doloribus.",
        article_id: 18,
        author: "tickle122",
        votes: -1,
        created_at: new Date(1468087638932)
      },
      {
        body: "Nobis consequatur animi. Ullam nobis quaerat voluptates veniam.",
        article_id: 20,
        author: "grumpy19",
        votes: 7,
        created_at: new Date(1478813209256)
      }
    ];
    expect(actual).to.eql(expected);
  });
});
