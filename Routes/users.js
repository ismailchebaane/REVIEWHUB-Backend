const router = require("express").Router()
const User = require("../Models/Person");
const md5 =require("md5");
const Post=require("../Models/Post")
const multer = require("multer");




const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "../uploads/");
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + "-" + file.originalname);
    },
  });
  
  const upload = multer({ storage: storage });

  
  


router.put('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.username = req.body.username;
    user.city = req.body.city;
    user.country = req.body.country;
    user.address = req.body.address;
    user.age = req.body.age;
    user.phone = req.body.phone;
    user.zip =  req.body.zip;
    user.email = req.body.email;

    const updatedUser = await user.save();

    res.status(200).send(updatedUser);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
  
router.put('/update/profilepicture/:id', upload.single('file'), async (req, res) => {
  console.log( req.file)
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.profilePicture = req.file.filename;
    user.updateOne({username:user.username},{profilePicture:req.file.filename})
   

    const updatedUser = await user.save();

    res.status(200).send(updatedUser);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


router.put('/update/password/:id',  async (req, res) => {
  
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.password = await md5(req.body.password);

    const updatedUser = await user.save();
    const{password,...others}=updatedUser._doc
 
    res.status(200).send(others);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


router.delete('/delete/:id', async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      if (!user) {
        res.status(404).json("User not found");
        return;
      }
  
     
   await Post.updateMany({ "REVIEWS.personId": req.params.id }, { $pull: { REVIEWS: { personId: req.params.id } } });

  


    
      await User.findOneAndDelete({_id:req.params.id});
  
      res.status(200).json("User and reviews deleted successfully");
    } catch (err) {
      console.error(err);
      res.status(500).json("Server error");
    }
  });
  






router.get('/:id' , async(req,res)=>
{
    try
    {
        const user = await User.findById(req.params.id)
        const {password , ...others} = user._doc;
      
        res.status(200).send(others)
   }
    catch (err) {
        res.status(500).json(err)
    }
})

module.exports = router;
