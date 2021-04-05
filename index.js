//This index module depends on two modules - Joi and express.
//Joi is a class
const Joi = require("joi");
const express = require("express");
const app = express();

/*Adding a piece of middleware used in request processing pipelines i.e;
to access req.body.name, we need to enable parsing of json object in the request body.*/
app.use(express.json());

const port = process.env.PORT || 3000;

const courses = [
  { id: 1, name: "course1" },
  { id: 2, name: "course2" },
  { id: 3, name: "course3" },
];

//GET starts here
app.get("/", (req, res) => {
  res.send("Hello World!!!");
});

//get courses
app.get("/api/courses", (req, res) => {
  res.send(courses);
});

//get single course
app.get("/api/courses/:id", (req, res) => {
  const course = courses.find((c) => c.id === parseInt(req.params.id));
  if (!course)
    res.status(404).send("The course with the given ID was not found.");
  res.send(course);
});

//reading query params (?sortBy=name)
app.get("/api/courses/:year/:month", (req, res) => {
  res.send(req.query);
});
//GET ends here

//POST starts here
app.post("/api/courses", (req, res) => {
  /* old validation convention
  if (!req.body.name || req.body.name.length < 3) {
    res.status(400).send("Name is required and should be min 3 characters.");
    return;
  }
  */

  //equivalent to validateCourse().error
  const { error } = validateCourse(req.body);

  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }
  const course = {
    id: courses.length + 1,
    name: req.body.name,
  };

  courses.push(course);
  res.send(course);
});
//POST ends here

//PUT starts here
app.put("/api/courses/:id", (req, res) => {
  const course = courses.find((c) => c.id === parseInt(req.params.id));
  if (!course) {
    return res.status(404).send("The course with the given ID was not found.");
  }

  //equivalent to validateCourse().error
  const { error } = validateCourse(req.body);

  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  course.name = req.body.name;
  res.send(course);
});
//PUT ends here

//DELETE starts
app.delete("/api/courses/:id", (req, res) => {
  const course = courses.find((c) => c.id === parseInt(req.params.id));
  if (!course) {
    return res.status(404).send("The course with the given ID was not found.");
  }

  const index = courses.indexOf(course);
  courses.splice(index, 1);
  res.send(courses);
});
//DELETE ends

//Listen to port
app.listen(3000, () => {
  console.log(`Listening on port ${port}...`);
});

function validateCourse(course) {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
  });

  return schema.validate(course);
}
