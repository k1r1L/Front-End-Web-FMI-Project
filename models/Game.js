const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
  title: { type: mongoose.Schema.Types.String, required: [true, 'Title is required!'] },
  size: { type: mongoose.Schema.Types.Number, required: [true, 'Size is required!']  },
  price: { type: mongoose.Schema.Types.Number, required: [true, 'Price is required!']  },
  trailer: { type: mongoose.Schema.Types.String, required: [true, 'Trailed ID is required!']  },
  imageUrl: { type: mongoose. Schema.Types.String, required: [true, 'Thumbnail is required!']  },
  description: { type: mongoose. Schema.Types.String, required: [true, 'Description is required!'] },
  date: { type: mongoose.Schema.Types.Date, required: [true, 'Date Released is required!'] }
});

gameSchema.path('title').validate(function () {
  let firstChar = this.title[0];

  return firstChar === firstChar.toUpperCase() 
  && this.title.length >= 3 && this.title.length <= 100;
}, 'Title must begin with uppercase and must be between 3 and 100 symbols inclusive');

gameSchema.path('price').validate(function () {
  return this.price > 0;
}, 'Price must be a positive number!');

gameSchema.path('size').validate(function () {
  return this.size > 0;
}, 'Size must be a positive number!');

gameSchema.path('trailer').validate(function () {
  return this.trailer.length === 11;
}, 'Trailer ID must be exactly 11 symbols long!');

gameSchema.path('imageUrl').validate(function () {
  return this.imageUrl.startsWith('http://') || this.imageUrl.startsWith('https://')
}, 'Image URL should be a VALID url!');

gameSchema.path('description').validate(function () {
  return this.description.length >= 20;
}, 'Description must be at least 20 symbols long');

const Game = mongoose.model('Game', gameSchema);
module.exports = Game;



