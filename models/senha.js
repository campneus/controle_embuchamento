module.exports = (sequelize, DataTypes) => {
  const Senha = sequelize.define('Senha', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    senha: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    data_hora: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    placa: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    orcamento: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    status: {
      type: DataTypes.STRING(20),
      defaultValue: 'Ativo'
    },
    cancelada: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    motivo_cancelamento: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    fornecedor_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'fornecedores',
        key: 'id'
      }
    },
    filial_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'filiais',
        key: 'id'
      }
    }
  }, {
    tableName: 'senhas',
    timestamps: false
  });

  Senha.associate = function(models) {
    // Relacionamentos
    Senha.belongsTo(models.Fornecedor, {
      foreignKey: 'fornecedor_id',
      as: 'fornecedor'
    });
    
    Senha.belongsTo(models.Filial, {
      foreignKey: 'filial_id',
      as: 'filial'
    });
  };

  return Senha;
};
