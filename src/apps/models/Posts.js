const { Sequelize, Model } = require("sequelize");

class Posts extends Model {
  static init(sequelize) {
    return super.init(
      {
        image: Sequelize.STRING,
        description: Sequelize.STRING,
        number_likes: Sequelize.INTEGER,
        author_id: Sequelize.INTEGER,
      },
      {
        sequelize, // Aqui você deve passar o objeto sequelize dentro do segundo parâmetro
      }
    );
  }
  static associate(models) {
    this.belongsTo(models.Users, { foreignKey: "author_id", as: "user" });
  }
}

module.exports = Posts;
