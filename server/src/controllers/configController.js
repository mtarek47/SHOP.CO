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
