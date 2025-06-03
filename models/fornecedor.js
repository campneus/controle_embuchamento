module.exports = (sequelize, DataTypes) => {
  const Fornecedor = sequelize.define('Fornecedor', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nome: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    cnpj: {
      type: DataTypes.STRING(18),
      allowNull: false,
      unique: true
    }
  }, {
    tableName: 'fornecedores',
    timestamps: false
  });

  Fornecedor.associate = function(models) {
    // Relacionamentos
    Fornecedor.hasMany(models.Filial, {
      foreignKey: 'fornecedor_id',
      as: 'filiais'
    });
    
    Fornecedor.hasMany(models.Senha, {
      foreignKey: 'fornecedor_id',
      as: 'senhas'
    });
  };

  return Fornecedor;
};
