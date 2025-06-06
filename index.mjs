import axios from "axios";
import dotenv from "dotenv";
import { DateTime } from "luxon";

dotenv.config();

const TODOIST_API_TOKEN = process.env.TODOIST_API_TOKEN;
const BASE_URL = "https://api.todoist.com/sync/v9";

export const handler = async (event) => {
  // We trigger this at 3am every day, but we want to get the previous day's score.

  const nDays = 1; // Default number of days
  let scores = {};

  try {
    for (let dayOffset = 1; dayOffset < nDays + 1; dayOffset++) {
      const date = DateTime.now()
        .setZone("America/Toronto")
        .minus({ days: dayOffset })
        .startOf("day");
      const dateString = date.toISODate();
      const completedTasks = await getCompletedTasks(date);
      console.log(`Completed tasks for ${dateString}:`, completedTasks);
      const dayScore = calculateDayScore(completedTasks);
      scores[dateString] = dayScore;
    }

    return {
      statusCode: 200,
      body: JSON.stringify(scores),
    };
  } catch (error) {
    console.error("Error fetching scores:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal Server Error" }),
    };
  }
};

async function getCompletedTasks(date) {
  try {
    const since = date.toUTC().toISO();
    const until = date.plus({ days: 1 }).minus({ seconds: 1 }).toUTC().toISO();

    console.log(`Fetching tasks from ${since} to ${until}`);

    const response = await axios.get(`${BASE_URL}/completed/get_all`, {
      headers: {
        Authorization: `Bearer ${TODOIST_API_TOKEN}`,
      },
      params: {
        since,
        until,
        limit: 200, // TODO: Paginate through the results, instead of assuming we have less than 200 tasks. Realistically, ain't noone completing this many tasks in a day.
        annotate_items: true,
      },
    });

    console.log(
      `Fetched ${response.data.items.length} tasks for date ${date.toISODate()}`
    );

    return response.data.items || [];
  } catch (error) {
    console.error(`Error fetching tasks for date ${date.toISODate()}:`, error);
    throw error;
  }
}

function calculateDayScore(tasks) {
  let score = 0;
  tasks.forEach((task) => {
    task.item_object.labels.forEach((label) => {
      if (label.endsWith("$") && !isNaN(parseInt(label))) {
        score += parseInt(label);
      }
    });
  });
  return score;
}
