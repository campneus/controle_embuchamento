module.exports = (sequelize, DataTypes) => {
  const Filial = sequelize.define('Filial', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    codigo: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    nome: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    fornecedor_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'fornecedores',
        key: 'id'
      }
    }
  }, {
    tableName: 'filiais',
    timestamps: false
  });

  Filial.associate = function(models) {
    // Relacionamentos
    Filial.belongsTo(models.Fornecedor, {
      foreignKey: 'fornecedor_id',
      as: 'fornecedor'
    });
    
    Filial.hasMany(models.Senha, {
      foreignKey: 'filial_id',
      as: 'senhas'
    });
  };

  return Filial;
};
