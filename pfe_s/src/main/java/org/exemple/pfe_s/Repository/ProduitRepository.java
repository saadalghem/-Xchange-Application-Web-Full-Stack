package org.exemple.pfe_s.Repository;

import org.exemple.pfe_s.Entity.Produit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProduitRepository extends JpaRepository<Produit, Long> {
    List<Produit> findByStatutOrderByIdDesc(String statut);
    List<Produit> findAllByOrderByIdDesc();
    List<Produit> findByUtilisateurId(Long id);
}
