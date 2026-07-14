import Config from '../models/Config.js';

// Default Hero Configuration values
const defaultHero = {
  title: 'FIND CLOTHES THAT MATCHES YOUR STYLE',
  description: 'Browse through our diverse range of meticulously crafted garments, designed to bring out your individuality and cater to your sense of style.',
  imageUrl: '/src/assets/hero-image.png',
  stats: [
    { num: '200+', label: 'International Brands' },
    { num: '2,000+', label: 'High-Quality Products' },
    { num: '30,000+', label: 'Happy Customers' }
  ]
};

// @desc    Get Hero settings
// @route   GET /api/config/hero
// @access  Public
export const getHeroConfig = async (req, res) => {
  try {
    const config = await Config.findOne({ key: 'hero_config' });
    if (config) {
      return res.json(config.value);
    }
    // Return fallback defaults if not configured yet
    return res.json(defaultHero);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update Hero settings
// @route   PUT /api/config/hero
// @access  Private/Admin
export const updateHeroConfig = async (req, res) => {
  try {
    const { title, description, imageUrl, stats } = req.body;

    if (!title || !description || !imageUrl || !stats) {
      return res.status(400).json({ message: 'All hero fields are required' });
    }

    let config = await Config.findOne({ key: 'hero_config' });

    if (config) {
      config.value = { title, description, imageUrl, stats };
      await config.save();
    } else {
      config = new Config({
        key: 'hero_config',
        value: { title, description, imageUrl, stats }
      });
      await config.save();
    }

    res.json({ message: 'Hero settings updated successfully', value: config.value });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Default Dress Style Images
const defaultDressStyle = {
  casual: 'https://placehold.co/600x350/d4d4d4/333333?text=Casual',
  formal: 'https://placehold.co/600x350/2c2c2c/ffffff?text=Formal',
  party: 'https://placehold.co/600x350/b8b0a4/333333?text=Party',
  gym: 'https://placehold.co/600x350/1a3c5e/ffffff?text=Gym',
};

// @desc    Get Dress Style settings
// @route   GET /api/config/dress-style
// @access  Public
export const getDressStyleConfig = async (req, res) => {
  try {
    const config = await Config.findOne({ key: 'dress_style_config' });
    if (config) {
      return res.json(config.value);
    }
    return res.json(defaultDressStyle);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update Dress Style settings
// @route   PUT /api/config/dress-style
// @access  Private/Admin
export const updateDressStyleConfig = async (req, res) => {
  try {
    const { casual, formal, party, gym } = req.body;

    let config = await Config.findOne({ key: 'dress_style_config' });

    if (config) {
      config.value = { casual, formal, party, gym };
      await config.save();
    } else {
      config = new Config({
        key: 'dress_style_config',
        value: { casual, formal, party, gym }
      });
      await config.save();
    }

    res.json({ message: 'Dress Style settings updated successfully', value: config.value });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
