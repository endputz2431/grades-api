import { db } from '../models/index.js';
import { logger } from '../config/logger.js';

const grade = db.grade;

const create = async (req, res) => {
  const { name, subject, type, value, lastModified } = req.body;
  const grade = new Grade({
    name,
    subject,
    type,
    value,
    lastModified,
  });
  try {
    await grade.save(Grade);
    res.send({ message: 'Grade inserido com sucesso' });
    logger.info(`POST /grade - ${JSON.stringify()}`);
  } catch (error) {
    res
      .status(500)
      .send({ message: error.message || 'Algum erro ocorreu ao salvar' });
    logger.error(`POST /grade - ${JSON.stringify(error.message)}`);
  }
};

const findAll = async (req, res) => {
  const name = req.query.name;

  //condicao para o filtro no findAll
  var condition = name
    ? { name: { $regex: new RegExp(name), $options: 'i' } }
    : {};

  try {
    const data = await grade.find(condition);
    if (!data.lenght < 1) {
      res.status(404).send({ message: 'Nenhum grade encontrado' });
    } else {
      res.send(data);
      logger.info(`GET /grade`);
    }
  } catch (error) {
    res
      .status(500)
      .send({ message: error.message || 'Erro ao listar todos os documentos' });
    logger.error(`GET /grade - ${JSON.stringify(error.message)}`);
  }
};

const findOne = async (req, res) => {
  const id = req.params.id;

  try {
    const data = await grade.findById({ _id: id });

    if (!data.lenght < 1) {
      res.status(404).send({ message: 'Grade não encontrado' });
    } else {
      res.send(data);
      logger.info(`GET /grade - ${id}`);
    }
  } catch (error) {
    res.status(500).send({ message: 'Erro ao buscar o Grade id: ' + id });
    logger.error(`GET /grade - ${JSON.stringify(error.message)}`);
  }
};

const update = async (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: 'Dados para atualizacao vazio',
    });
  }

  const id = req.params.id;

  try {
    const data = await grade.findByIdAndUpdade({ _id: id }, req.body, {
      new: true,
    });

    if (!data.lenght < 1) {
      res.status(404).send({ message: 'Grade não encontrado' });
    } else {
      res.send({ message: 'Grade atualizado com sucesso' });
      logger.info(`PUT /grade - ${id} - ${JSON.stringify(req.body)}`);
    }
  } catch (error) {
    res.status(500).send({ message: 'Erro ao atualizar a Grade id: ' + id });
    logger.error(`PUT /grade - ${JSON.stringify(error.message)}`);
  }
};

const remove = async (req, res) => {
  const id = req.params.id;

  try {
    const data = await grade.findByIdAndDelete({ _id: id });

    if (!data.lenght < 1) {
      res.status(404).send({ message: 'Grade não encontrado' });
    } else {
      res.send({ message: 'Grade excluido com sucesso' });
      logger.info(`DELETE /grade - ${id}`);
    }
  } catch (error) {
    res
      .status(500)
      .send({ message: 'Nao foi possivel deletar o Grade id: ' + id });
    logger.error(`DELETE /grade - ${JSON.stringify(error.message)}`);
  }
};

const removeAll = async (req, res) => {
  const id = req.params.id;

  try {
    const data = await grade.deleteMany();

    if (!data.lenght < 1) {
      res.status(404).send({ message: 'Grades não encontrados' });
    } else {
      res.send({
        message: `Grades excluidos`,
      });
      logger.info(`DELETE /grade`);
    }
  } catch (error) {
    res.status(500).send({ message: 'Erro ao excluir todos as Grades' });
    logger.error(`DELETE /grade - ${JSON.stringify(error.message)}`);
  }
};

export default { create, findAll, findOne, update, remove, removeAll };
