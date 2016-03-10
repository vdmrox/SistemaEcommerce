package model.dao;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;

import model.domain.Cliente;

public class ClienteDaoImpl implements ClienteDao {
	
	@PersistenceContext(unitName="SistemaEcommercePU")
	private EntityManager entityManager;
	
	@Override
	@SuppressWarnings("unchecked")
	public List<Cliente> getClientes(Cliente cliente) {
		StringBuffer hql = new StringBuffer("from Cliente c"
				+ " where 1 = 1");		
		if (cliente.getCodigo() != null) {
			hql.append(" and c.codigo = :codigo");
		}
		Query query = entityManager.createQuery(hql.toString());
		if (cliente.getCodigo() != null) {
			query.setParameter("codigo",cliente.getCodigo());
		} 
		return query.getResultList();
	}
	

}
