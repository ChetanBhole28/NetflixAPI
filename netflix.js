const express = require("express");
const router = express.Router();
const connection = require('./database');
const randomstring = require('randomstring');

const app = express();

app.use(router);

//Users API
const getUserById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            res.status(400).send({
                message: "invalid request",
            });
        }
        let queryString = `SELECT email_id, password from users where user_id = ?`;
        const [result] = await connection.promise().execute(queryString, [id]);

        if (result.length === 0) {
            res.status(404).send({
                message: "User not found",
            });
        }
        res.status(200).send({
            message: "Successfully user received",
            result,
        });
    } catch (error) {
        res.status(500).send({
            message: "internal server error",
            error,
        });
    }
};

const createUser = async (req, res) => {
    try {
        const { email_id, password } = req.body;

        if (!email_id || !password) {
            res.status(400).send({
                message: "Invalid request",
            });
        }

        const queryString = `INSERT into users(email_id, password)VALUES ( ?, ?)`;

        const [results] = await connection.promise().execute(queryString, [email_id, password]);

        res.status(201).send({
            message: "User added successfully",
            results,
        });
    }
    catch (error) {
        res.status(500).send({
            message: "internal server error",
            error,
        });
    }

};

const updateUser = async (req, res) => {
    const { id } = req.params;
    const { email_id, password } = req.body;
  
    if (!id && !email_id && !password ) {
    
      res.status(400).send({
        message: "Invalid request",
      });
    }
  
    let setData = [];
    let queryData = [];
  
    if (email_id) {
      setData.push("email_id=?");
      queryData.push(email_id);
    }
  
    if (password) {
      setData.push("password=?");
      queryData.push(password);
    }
  
    const setString = setData.join(",");
  
    const queryString = `UPDATE users SET ${setString} WHERE user_id = ? `;
  
    const [results] = await connection.promise().execute(queryString, [...queryData, id]);
  
    res.status(201).send({
      message: "User updated successfully",
      results,
    });
  
  
};

const deleteWishlist = async (req, res) => {
    try {
      const { id } = req.params;
  
      if (!id) {
        return res.status(400).send({
          message: "Invalid request: ID is missing",
        });
      }
  
      const queryString = "UPDATE users SET is_active = 0 WHERE user_id = ?";
      const [result] = await connection.promise().execute(queryString, [id]);
  
      const responseBody = {
        message: "Successfully deleted user",
        list: result
      };
      res.status(200).send(responseBody);
    } catch (error) {
      res.status(500).send({ message: "Internal Server Error" });
    }
};

//Profiles API
const getAllProfiles = async (req, res) => {
    try {
      const { limit, offset } = req.query;
     if(!limit){
        res.send({
            message: "1 User can have upto 5 profiles"
        })
     }
      const queryString = "SELECT users.email_id, profiles.full_name, profiles.type FROM users INNER JOIN profiles ON users.user_id = profiles.user_id LIMIT ? OFFSET ?";
      const [results] = await connection.promise().execute(queryString, [limit, offset]);

      const countQueryString = "SELECT COUNT(*) as count FROM profiles";
      const [countResults] = await connection.promise().execute(countQueryString);
  
      const responseBody = {
        message: "profiles list",
        list: results,
        count: countResults[0].count,
      };
  
      res.status(200).send(responseBody);
  
    } catch (err) {
    
      res.status(500).send({ message: "Internal Server Error" });
    }
};

const createProfile = async (req, res) => {
    const { user_id, full_name, type } = req.body;
  
    if (!full_name && !type ) {
      res.status(400).send({
        message: "Invalid data",
      });
    }
  
    const queryString = `INSERT INTO profiles(user_id, full_name, type)values (?, ?, ?)`;
  
    const [results] = await connection.promise().execute(queryString, [user_id, full_name, type]);
  
    res.status(201).send({
      message: "Profile created successfully",
      results,
    });
    
};

const updateProfile = async (req, res) => {
    const { id } = req.params;
    const { full_name, type } = req.body;
  
    if (!id) {
      res.status(400).send({
        message: "Invalid request",
      });
    }
  
    let setData = [];
    let queryData = [];
  
    if (full_name) {
      setData.push("full_name=?");
      queryData.push(full_name);
    }
  
    if (type) {
      setData.push("type=?");
      queryData.push(type);
    }
  
    const setString = setData.join(",");
  
    const queryString = `UPDATE profiles SET ${setString} WHERE profile_id = ? `;
  
    const [results] = await connection.promise().execute(queryString, [...queryData, id]);
  
    res.status(201).send({
      message: "Profile updated successfully",
      results,
    });
  
  
};

const deleteProfile = async (req, res) => {
    try {
      const { id } = req.params;
  
      if (!id) {
        return res.status(400).send({
          message: "Invalid request: ID is missing",
        });
      }
  
      const queryString = "UPDATE profiles SET is_active = 0 WHERE profile_id = ?";
      const [result] = await connection.promise().execute(queryString, [id]);
  
      const responseBody = {
        message: "Successfully deleted user",
        list: result
      };
      res.status(200).send(responseBody);
    } catch (error) {
      res.status(500).send({ message: "Internal Server Error" });
    }
};

//Video API
const getVideos = async (req, res) => {
    try {
      const { limit, offset } = req.query;
     if(!limit){
        res.send({
            message: "limit required"
        })
     }
      const queryString = `SELECT title, cast, description FROM videos ORDER BY title LIMIT ? OFFSET ?`;
      const [results] = await connection.promise().execute(queryString, [limit, offset]);

      const countQueryString = "SELECT COUNT(*) as count FROM videos";
      const [countResults] = await connection.promise().execute(countQueryString);
  
      const responseBody = {
        message: "Video list",
        list: results,
        count: countResults[0].count,
      };
  
      res.status(200).send(responseBody);
  
    } catch (err) {
    
      res.status(500).send({ message: "Internal Server Error" });
    }
};

const addVideo = async (req, res) => {
    const { title, cast, description } = req.body;
  
    if (!title || !cast || !description) {
      res.status(400).send({
        message: "Invalid request",
      });
    }

    const queryString = `INSERT INTO videos (title, cast, description) VALUES ( ?, ?, ?)`;
    const [results] = await connection.promise().execute(queryString, [title, cast, description]);
  
    res.status(201).send({
      message: "Video added successfully",
      results,
    });
  
};

const watchedVideo = async (req, res) => {
    try {
      const { video_id } = req.params;
      
     if(!video_id){
        res.send({
            message: "invalid request"
        })
     }
      const queryString = `SELECT profiles.profile_id, profiles.full_name AS profile_name, videos.title AS video_title, watched_videos.status AS video_status FROM profiles INNER JOIN watched_videos ON profiles.profile_id = watched_videos.profile_id INNER JOIN videos ON watched_videos.video_id = videos.video_id`;
      const [results] = await connection.promise().execute(queryString, [video_id]);

      const countQueryString = "SELECT COUNT(*) as count FROM videos";
      const [countResults] = await connection.promise().execute(countQueryString);
  
      const responseBody = {
        message: "Video list",
        list: results,
        count: countResults[0].count,
      };
  
      res.status(200).send(responseBody);
  
    } catch (err) {
    
      res.status(500).send({ message: "Internal Server Error" });
    }
};

const videoActor = async (req, res) => {
    try {
      const { actor_id } = req.params;
      
     if(!actor_id){
        res.send({
            message: "invalid request"
        })
     }
      const queryString = `SELECT videos.title AS video_title, GROUP_CONCAT(actors.full_name) AS actors
      FROM videos
      INNER JOIN video_actors ON videos.video_id = video_actors.video_id
      INNER JOIN actors ON video_actors.actor_id = actors.actor_id
      GROUP BY videos.video_id`;
      const [results] = await connection.promise().execute(queryString, [actor_id]);

      const countQueryString = "SELECT COUNT(*) as count FROM videos";
      const [countResults] = await connection.promise().execute(countQueryString);
  
      const responseBody = {
        message: "Video and Actors list",
        list: results,
        count: countResults[0].count,
      };
  
      res.status(200).send(responseBody);
  
    } catch (err) {
    
      res.status(500).send({ message: "Internal Server Error" });
    }
};

const userLogin = async (req, res) => {
    try {
      const { email_id, password } = req.body;
  
      if (!email_id || !password) {
        res.status(400).send({
          message: "Email and Password Required",
        });
      }
      let queryString = ` SELECT user_id FROM users WHERE email_id = ? AND password = ?`;
      const [result] = await connection.promise().execute(queryString, [email_id, password]);
  
      if (result.length === 0) {
        res.status(401).send({
          message: "Invalid email or password",
        });
      }
      res.status(200).send({
        message: "Logged In Successfully",
        result
      });
    } catch (error) {
      res.status(500).send({
        message: "internal server error",
        error,
      });
    }
};

const otpGenerate = async (req, res) => {
  
    try {
      const { email } = req.body;
      if (!email) {
        res.status(400).send({
          message: "Email Required",
        });
      }
  
      function generateOTP() {
        return randomstring.generate({
            length: 4,
            charset: 'numeric'
        });
      }
    const otp = generateOTP();
  
      let otpString = `INSERT INTO otp (email, otp_code) VALUES (?, ?)`;
      const [result] = await connection.promise().execute(otpString, [email, otp]);
  
      res.status(200).send({
        message: "Otp Generated Successfully",
        result
      });
    } catch (error) {
      res.status(500).send({
        message: "Internal Server Error",
        error,
      });
    }
};

//Middleware 
const authMiddle = async (req, res, next) => {
  
    try {
      const { user_id, token } = req.headers;
      if (!user_id || !token) {
        res.status(400).send({
          message: "User_Id and Token Required",
        });
      }
  
      if (user_id !== '9568f19f-7ffa-4f37-bb81-6c46df217931' || token !== 'Chetan!!!') {
        return res.status(401).json({
             message: 'Invalid user ID or token'
           });
    }
    next();
    } catch (error) {
      res.status(500).send({
        message: "Internal Server Error",
        error,
      });
    }
};

//Users API
router.get("/users/:id", getUserById);
router.post("/users", createUser);
router.put("/users/:id", updateUser);
router.delete("/users/:id", deleteWishlist);

//Profiles API
router.get("/profiles", authMiddle, getAllProfiles);
router.post("/profiles", createProfile);
router.put("/profiles/:id", updateProfile);
router.delete("/profiles/:id", deleteProfile);

//Video API
router.get("/videos", getVideos);
router.post("/videos", addVideo);

//Video Status API
router.get("/videos/:video_id", watchedVideo);

//Video Cast API
router.get("/videoactors/:actor_id", videoActor);

//Login API
router.post("/login", userLogin);

//Forgot Password
router.post("/fpassword", otpGenerate);


module.exports = router;

