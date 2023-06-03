const router = require("express").Router()
const Person = require("../Models/Person");
const Post = require("../Models/Post");





router.post('/:postId', async (req, res) => {
  
  try {
    const post = await Post.findOne({_id: req.params.postId});

    if (!post) {
      console.error('Post not found!');
      res.status(404).send('Post not found!');
    } 

      post.REVIEWS.push({
        personId: req.body.personId,
        username: req.body.username,
        pic:req.body.pic,
        rate: req.body.rate,
        comments: req.body.comments,
        like: 0,
        dislike:0

      });

      const updatedPost = await post.save();
      res.send(updatedPost);
    
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

router.put('/:id/:reviewId/like', async (req, res) => {
  const postId = req.params.id;
  const reviewId = req.params.reviewId;
  const userId = req.body.personId; 
  try {
    const post = await Post.findById(postId);
    const review = post.REVIEWS.find(r => r._id.equals(reviewId));
    if (!review.likes.includes(userId) && !review.dislikes.includes(userId)) {
      review.likes.push(userId);
      await post.save();
    }
    else if (!review.likes.includes(userId) && review.dislikes.includes(userId)) {
      review.dislikes = review.dislikes.filter((item)=> (item!==userId));
      review.likes.push(userId);

      await post.save();
    }

    res.status(200).json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/:id/:reviewId/dislike', async (req, res) => {
  const postId = req.params.id;
  const reviewId = req.params.reviewId;
  const userId = req.body.personId; 
  
  try {
    const post = await Post.findById(postId);
    const review = post.REVIEWS.find(r => r._id.equals(reviewId));
    if (!review.dislikes.includes(userId) && !review.likes.includes(userId)) {
      review.dislikes.push(userId);
      await post.save();
    }
    else if (review.likes.includes(userId) && !review.dislikes.includes(userId)) {
      review.likes = review.likes.filter((item)=> (item!==userId));
     
      review.dislikes.push(userId);
      await post.save();
    }

    res.status(200).json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});






router.put('/:id', async (req, res) => {
  try {
    const post = await Post.findOne({ 'REVIEWS._id': req.params.id });
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const reviewIndex = post.REVIEWS.findIndex(review => review._id == req.params.id);
    if (reviewIndex === -1) {
      return res.status(404).json({ error: 'Review not found' });
    }

    post.REVIEWS[reviewIndex].comments = req.body.comments;
    post.REVIEWS[reviewIndex].rate = req.body.rate;
    const updatedPost = await post.save();
    res.status(200).json(updatedPost.REVIEWS);
  } catch (err) {
    console.error(`Error updating review: ${err}`);
    res.status(500).json({ error: 'Error updating review' });
  }
});

  

router.delete('/:id', async (req, res ) => {
  console.log(req.params.id)
  try {
    const post = await Post.findOne({ 'REVIEWS._id': req.params.id });
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const reviewIndex = post.REVIEWS.findIndex(review => review._id == req.params.id);
    if (reviewIndex === -1) {
      return res.status(404).json({ message: 'Review not found' });
    }
    
    post.REVIEWS.splice(reviewIndex, 1);
    const updatedPost = await post.save();
    res.status(200).json(updatedPost.REVIEWS);
    
  } catch (err) {
    console.error(`Error deleting review with ID ${req.params.id}: ${err}`);
    next(err);
  }
});





module.exports = router;
