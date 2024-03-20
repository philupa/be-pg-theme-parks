/* make sure you write your tests for your utils functions in here :eyes: */

const { prepareData, prepareRideData } = require("../db/utils/prepareData");

describe("prepareData", () => {
  test("should not mutate the data", () => {
    const input = [{ park_name: "Thorpe Park", year_opened: 1979, annual_attendance: 1700000 }];
    const actual = [{ park_name: "Thorpe Park", year_opened: 1979, annual_attendance: 1700000 }];
    prepareData(input);
    expect(input).toEqual(actual);
  });
  test("should return an array", () => {
    const input = [{ park_name: "Thorpe Park", year_opened: 1979, annual_attendance: 1700000 }];
    const output = prepareData(input);
    const actual = [["Thorpe Park", 1979, 1700000]];
    console.log(output);
    expect(actual).toEqual(output);
  });

  test("returns a nested array when passed an array with multiple objects", () => {
    const input = [
      { park_name: "Thorpe Park", year_opened: 1979, annual_attendance: 1700000 },
      { park_name: "a", year_opened: 1, annual_attendance: 2 },
    ];
    const output = prepareData(input);
    const actual = [
      ["Thorpe Park", 1979, 1700000],
      ["a", 1, 2],
    ];
    console.log(output);
    expect(actual).toEqual(output);
  });
});

////

describe("prepareRideData", () => {
  test("should not mutate the data", () => {
    const input = [
      {
        ride_name: "Colossus",
        year_opened: 2002,
        park_name: "Thorpe Park",
        votes: 5,
      },
    ];
    const actual = [
      {
        ride_name: "Colossus",
        year_opened: 2002,
        park_name: "Thorpe Park",
        votes: 5,
      },
    ];

    const input2 = [
      {
        park_id: 1,
        park_name: "Thorpe Park",
        year_opened: 1979,
        annual_attendance: 1700000,
      },
    ];

    prepareRideData(input, input2);
    expect(input).toEqual(actual);
  });

  test("should return an array", () => {
    const input = [
      {
        ride_name: "Colossus",
        year_opened: 2002,
        park_name: "Thorpe Park",
        votes: 5,
      },
    ];

    const input2 = [
      {
        park_id: 1,
        park_name: "Thorpe Park",
        year_opened: 1979,
        annual_attendance: 1700000,
      },
    ];
    expect(prepareRideData(input, input2)).toEqual([[1, "Colossus", 2002, 5]]);
  });

  test("returns an array of arrays....", () => {
    const input = [
      {
        ride_name: "Colossus",
        year_opened: 2002,
        park_name: "Thorpe Park",
        votes: 5,
      },
      {
        ride_name: "Stealth",
        year_opened: 2006,
        park_name: "Thorpe Park",
        votes: 4,
      },
    ];

    const input2 = [
      {
        park_id: 1,
        park_name: "Thorpe Park",
        year_opened: 1979,
        annual_attendance: 1700000,
      },
    ];
    expect(prepareRideData(input, input2)).toEqual([
      [1, "Colossus", 2002, 5],
      [1, "Stealth", 2006, 4],
    ]);
  });
});
